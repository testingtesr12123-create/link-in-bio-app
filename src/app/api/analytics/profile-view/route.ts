import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, profileViews } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

const VALID_DEVICE_TYPES = ['mobile', 'desktop', 'tablet'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, referrer, device_type } = body;

    // Validate username
    if (!username || typeof username !== 'string' || username.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Username is required and must be a non-empty string',
          code: 'MISSING_USERNAME'
        },
        { status: 400 }
      );
    }

    // Validate device_type if provided
    if (device_type !== undefined && device_type !== null) {
      if (typeof device_type !== 'string' || !VALID_DEVICE_TYPES.includes(device_type)) {
        return NextResponse.json(
          {
            error: `Invalid device type. Must be one of: ${VALID_DEVICE_TYPES.join(', ')}`,
            code: 'INVALID_DEVICE_TYPE'
          },
          { status: 400 }
        );
      }
    }

    // Find user by username (case-insensitive)
    const user = await db
      .select()
      .from(users)
      .where(sql`LOWER(${users.username}) = LOWER(${username.trim()})`)
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        {
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Create profile view record
    const profileView = await db
      .insert(profileViews)
      .values({
        userId: user[0].id,
        viewedAt: new Date().toISOString(),
        referrer: referrer || null,
        deviceType: device_type || null
      })
      .returning();

    return NextResponse.json(profileView[0], { status: 201 });

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