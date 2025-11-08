import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { links } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    const linkId = parseInt(id);

    // Check if link exists
    const existingLink = await db
      .select()
      .from(links)
      .where(eq(links.id, linkId))
      .limit(1);

    if (existingLink.length === 0) {
      return NextResponse.json(
        {
          error: 'Link not found',
          code: 'LINK_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Increment clicks and update timestamp
    const updatedLink = await db
      .update(links)
      .set({
        clicks: sql`${links.clicks} + 1`,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(links.id, linkId))
      .returning();

    return NextResponse.json(updatedLink[0], { status: 200 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}