import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, links, profileViews, linkClicks } from '@/db/schema';
import { eq, sql, and, gte, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    // Validate username parameter
    if (!username) {
      return NextResponse.json(
        { 
          error: 'Username parameter is required',
          code: 'MISSING_USERNAME' 
        },
        { status: 400 }
      );
    }

    // Find user by username (case-insensitive)
    const userResult = await db
      .select()
      .from(users)
      .where(sql`LOWER(${users.username}) = LOWER(${username})`)
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json(
        { 
          error: 'User not found',
          code: 'USER_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    const user = userResult[0];

    // Calculate 30 days ago timestamp
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Get total profile views
    const totalViewsResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(profileViews)
      .where(eq(profileViews.userId, user.id));
    const totalViews = Number(totalViewsResult[0]?.count || 0);

    // Get profile views last 30 days
    const viewsLast30DaysResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(profileViews)
      .where(
        and(
          eq(profileViews.userId, user.id),
          gte(profileViews.viewedAt, thirtyDaysAgo)
        )
      );
    const viewsLast30Days = Number(viewsLast30DaysResult[0]?.count || 0);

    // Get total link clicks
    const totalClicksResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(linkClicks)
      .innerJoin(links, eq(linkClicks.linkId, links.id))
      .where(eq(links.userId, user.id));
    const totalClicks = Number(totalClicksResult[0]?.count || 0);

    // Get link clicks last 30 days
    const clicksLast30DaysResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(linkClicks)
      .innerJoin(links, eq(linkClicks.linkId, links.id))
      .where(
        and(
          eq(links.userId, user.id),
          gte(linkClicks.clickedAt, thirtyDaysAgo)
        )
      );
    const clicksLast30Days = Number(clicksLast30DaysResult[0]?.count || 0);

    // Calculate click-through rate
    const clickThroughRate = totalViews > 0 
      ? Number(((totalClicks / totalViews) * 100).toFixed(2))
      : 0;

    // Get top 5 performing links
    const topLinksResult = await db
      .select({
        id: links.id,
        title: links.title,
        url: links.url,
        clicks: sql<number>`COUNT(${linkClicks.id})`
      })
      .from(links)
      .leftJoin(linkClicks, eq(links.id, linkClicks.linkId))
      .where(eq(links.userId, user.id))
      .groupBy(links.id, links.title, links.url)
      .orderBy(desc(sql`COUNT(${linkClicks.id})`))
      .limit(5);

    const topLinks = topLinksResult.map(link => ({
      id: link.id,
      title: link.title,
      url: link.url,
      clicks: Number(link.clicks)
    }));

    // Get daily stats for last 30 days
    const dailyViewsResult = await db
      .select({
        date: sql<string>`date(${profileViews.viewedAt})`,
        views: sql<number>`COUNT(*)`
      })
      .from(profileViews)
      .where(
        and(
          eq(profileViews.userId, user.id),
          gte(profileViews.viewedAt, thirtyDaysAgo)
        )
      )
      .groupBy(sql`date(${profileViews.viewedAt})`);

    const dailyClicksResult = await db
      .select({
        date: sql<string>`date(${linkClicks.clickedAt})`,
        clicks: sql<number>`COUNT(*)`
      })
      .from(linkClicks)
      .innerJoin(links, eq(linkClicks.linkId, links.id))
      .where(
        and(
          eq(links.userId, user.id),
          gte(linkClicks.clickedAt, thirtyDaysAgo)
        )
      )
      .groupBy(sql`date(${linkClicks.clickedAt})`);

    // Create a map for easy lookup
    const viewsMap = new Map(dailyViewsResult.map(v => [v.date, Number(v.views)]));
    const clicksMap = new Map(dailyClicksResult.map(c => [c.date, Number(c.clicks)]));

    // Generate array of last 30 days
    const dailyStats = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      dailyStats.push({
        date: dateStr,
        views: viewsMap.get(dateStr) || 0,
        clicks: clicksMap.get(dateStr) || 0
      });
    }

    // Get device breakdown
    const deviceBreakdownResult = await db
      .select({
        deviceType: profileViews.deviceType,
        count: sql<number>`COUNT(*)`
      })
      .from(profileViews)
      .where(eq(profileViews.userId, user.id))
      .groupBy(profileViews.deviceType);

    const deviceCounts: Record<string, number> = {
      mobile: 0,
      desktop: 0,
      tablet: 0,
      unknown: 0
    };

    deviceBreakdownResult.forEach(device => {
      const type = device.deviceType?.toLowerCase() || 'unknown';
      const count = Number(device.count);
      if (type === 'mobile' || type === 'desktop' || type === 'tablet') {
        deviceCounts[type] = count;
      } else {
        deviceCounts.unknown += count;
      }
    });

    const deviceBreakdown = {
      mobile: {
        count: deviceCounts.mobile,
        percentage: totalViews > 0 
          ? Number(((deviceCounts.mobile / totalViews) * 100).toFixed(2))
          : 0
      },
      desktop: {
        count: deviceCounts.desktop,
        percentage: totalViews > 0 
          ? Number(((deviceCounts.desktop / totalViews) * 100).toFixed(2))
          : 0
      },
      tablet: {
        count: deviceCounts.tablet,
        percentage: totalViews > 0 
          ? Number(((deviceCounts.tablet / totalViews) * 100).toFixed(2))
          : 0
      },
      unknown: {
        count: deviceCounts.unknown,
        percentage: totalViews > 0 
          ? Number(((deviceCounts.unknown / totalViews) * 100).toFixed(2))
          : 0
      }
    };

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name
      },
      analytics: {
        totalViews,
        viewsLast30Days,
        totalClicks,
        clicksLast30Days,
        clickThroughRate,
        topLinks,
        dailyStats,
        deviceBreakdown
      }
    }, { status: 200 });

  } catch (error) {
    console.error('GET analytics error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}