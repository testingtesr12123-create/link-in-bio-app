import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, themes, links } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    if (!username) {
      return NextResponse.json(
        { error: 'Username parameter is required', code: 'MISSING_USERNAME' },
        { status: 400 }
      );
    }

    // Query user by username (case-insensitive using LOWER)
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.username, username.toLowerCase()))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const user = userResult[0];

    // Fetch related theme
    const themeResult = await db
      .select()
      .from(themes)
      .where(eq(themes.userId, user.id))
      .limit(1);

    const theme = themeResult.length > 0 ? themeResult[0] : null;

    // Fetch active links ordered by position
    const userLinks = await db
      .select()
      .from(links)
      .where(and(eq(links.userId, user.id), eq(links.isActive, true)))
      .orderBy(asc(links.position));

    // Return complete user object with nested theme and links
    return NextResponse.json({
      id: user.id,
      username: user.username,
      name: user.name,
      bio: user.bio,
      profileImageUrl: user.profileImageUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      theme: theme,
      links: userLinks,
    });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    if (!username) {
      return NextResponse.json(
        { error: 'Username parameter is required', code: 'MISSING_USERNAME' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, bio, profile_image_url } = body;

    // Find user by username first
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.username, username.toLowerCase()))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const user = userResult[0];

    // Build update object with only provided fields
    const updates: {
      name?: string | null;
      bio?: string | null;
      profileImageUrl?: string | null;
      updatedAt: string;
    } = {
      updatedAt: new Date().toISOString(),
    };

    // Sanitize and add optional fields
    if (name !== undefined) {
      updates.name = name ? name.trim() : null;
    }

    if (bio !== undefined) {
      updates.bio = bio;
    }

    if (profile_image_url !== undefined) {
      updates.profileImageUrl = profile_image_url;
    }

    // Update user record
    const updatedUser = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, user.id))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update user', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}