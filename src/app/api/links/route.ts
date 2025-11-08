import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { links, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, title, url, icon, layout, position } = body;

    // Validate required fields
    if (!user_id) {
      return NextResponse.json(
        { 
          error: 'user_id is required',
          code: 'MISSING_USER_ID'
        },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { 
          error: 'title is required',
          code: 'MISSING_TITLE'
        },
        { status: 400 }
      );
    }

    if (!url) {
      return NextResponse.json(
        { 
          error: 'url is required',
          code: 'MISSING_URL'
        },
        { status: 400 }
      );
    }

    if (position === undefined || position === null) {
      return NextResponse.json(
        { 
          error: 'position is required',
          code: 'MISSING_POSITION'
        },
        { status: 400 }
      );
    }

    // Validate user_id is a valid integer
    const userIdInt = parseInt(user_id);
    if (isNaN(userIdInt)) {
      return NextResponse.json(
        { 
          error: 'user_id must be a valid integer',
          code: 'INVALID_USER_ID'
        },
        { status: 400 }
      );
    }

    // Validate position is a valid integer
    const positionInt = parseInt(position);
    if (isNaN(positionInt)) {
      return NextResponse.json(
        { 
          error: 'position must be a valid integer',
          code: 'INVALID_POSITION'
        },
        { status: 400 }
      );
    }

    // Validate layout if provided
    if (layout !== undefined && layout !== null) {
      const validLayouts = ['default', 'icon-only', 'thumbnail', 'card', 'minimal', 'featured'];
      if (!validLayouts.includes(layout)) {
        return NextResponse.json(
          { 
            error: `layout must be one of: ${validLayouts.join(', ')}`,
            code: 'INVALID_LAYOUT'
          },
          { status: 400 }
        );
      }
    }

    // Verify user exists
    const userExists = await db.select()
      .from(users)
      .where(eq(users.id, userIdInt))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json(
        { 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedTitle = title.trim();
    const sanitizedUrl = url.trim();

    // Validate sanitized fields are not empty
    if (!sanitizedTitle) {
      return NextResponse.json(
        { 
          error: 'title cannot be empty',
          code: 'EMPTY_TITLE'
        },
        { status: 400 }
      );
    }

    if (!sanitizedUrl) {
      return NextResponse.json(
        { 
          error: 'url cannot be empty',
          code: 'EMPTY_URL'
        },
        { status: 400 }
      );
    }

    // Prepare insert data with auto-generated fields
    const newLink = await db.insert(links)
      .values({
        userId: userIdInt,
        title: sanitizedTitle,
        url: sanitizedUrl,
        icon: icon || null,
        layout: layout || 'default',
        position: positionInt,
        isActive: true,
        clicks: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newLink[0], { status: 201 });

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