import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, name, bio, profile_image_url } = body;

    // Validate required field
    if (!username || typeof username !== 'string' || username.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Username is required and cannot be empty',
          code: 'MISSING_USERNAME'
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedUsername = username.trim().toLowerCase();
    const sanitizedName = name ? name.trim() : null;
    const sanitizedBio = bio ? bio.trim() : null;
    const sanitizedProfileImageUrl = profile_image_url ? profile_image_url.trim() : null;

    // Validate username length (reasonable constraint)
    if (sanitizedUsername.length < 3) {
      return NextResponse.json(
        { 
          error: 'Username must be at least 3 characters long',
          code: 'USERNAME_TOO_SHORT'
        },
        { status: 400 }
      );
    }

    if (sanitizedUsername.length > 50) {
      return NextResponse.json(
        { 
          error: 'Username must not exceed 50 characters',
          code: 'USERNAME_TOO_LONG'
        },
        { status: 400 }
      );
    }

    // Validate username format (alphanumeric, underscore, hyphen)
    const usernameRegex = /^[a-z0-9_-]+$/;
    if (!usernameRegex.test(sanitizedUsername)) {
      return NextResponse.json(
        { 
          error: 'Username can only contain lowercase letters, numbers, underscores, and hyphens',
          code: 'INVALID_USERNAME_FORMAT'
        },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.username, sanitizedUsername))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { 
          error: 'Username already exists',
          code: 'USERNAME_EXISTS'
        },
        { status: 409 }
      );
    }

    // Generate timestamps
    const now = new Date().toISOString();

    // Insert new user
    const newUser = await db.insert(users)
      .values({
        username: sanitizedUsername,
        name: sanitizedName,
        bio: sanitizedBio,
        profileImageUrl: sanitizedProfileImageUrl,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    return NextResponse.json(newUser[0], { status: 201 });

  } catch (error: any) {
    console.error('POST users error:', error);

    // Handle UNIQUE constraint violation (additional safety check)
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { 
          error: 'Username already exists',
          code: 'USERNAME_EXISTS'
        },
        { status: 409 }
      );
    }

    // Handle other database errors
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error.message,
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}