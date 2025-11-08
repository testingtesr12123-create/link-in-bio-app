import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { links, linkClicks } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { link_id, referrer } = body;

    // Validate link_id is provided
    if (!link_id) {
      return NextResponse.json(
        { 
          error: 'link_id is required',
          code: 'MISSING_LINK_ID'
        },
        { status: 400 }
      );
    }

    // Validate link_id is a valid integer
    const linkId = parseInt(link_id);
    if (isNaN(linkId)) {
      return NextResponse.json(
        { 
          error: 'link_id must be a valid integer',
          code: 'INVALID_LINK_ID'
        },
        { status: 400 }
      );
    }

    // Verify link exists
    const existingLink = await db.select()
      .from(links)
      .where(eq(links.id, linkId))
      .limit(1);

    if (existingLink.length === 0) {
      return NextResponse.json(
        { 
          error: 'Link not found',
          code: 'LINK_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Create linkClicks record
    const newLinkClick = await db.insert(linkClicks)
      .values({
        linkId: linkId,
        clickedAt: new Date().toISOString(),
        referrer: referrer || null
      })
      .returning();

    // Increment links.clicks counter
    await db.update(links)
      .set({
        clicks: sql`${links.clicks} + 1`,
        updatedAt: new Date().toISOString()
      })
      .where(eq(links.id, linkId));

    return NextResponse.json(newLinkClick[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}