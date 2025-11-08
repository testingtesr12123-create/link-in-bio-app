import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { links: linksToUpdate } = body;

    // Validate links array exists
    if (!linksToUpdate) {
      return NextResponse.json(
        { error: 'Links array is required', code: 'MISSING_LINKS_ARRAY' },
        { status: 400 }
      );
    }

    // Validate links is an array
    if (!Array.isArray(linksToUpdate)) {
      return NextResponse.json(
        { error: 'Links must be an array', code: 'INVALID_LINKS_FORMAT' },
        { status: 400 }
      );
    }

    // Validate array is not empty
    if (linksToUpdate.length === 0) {
      return NextResponse.json(
        { error: 'Links array cannot be empty', code: 'EMPTY_LINKS_ARRAY' },
        { status: 400 }
      );
    }

    // Validate each link object
    for (let i = 0; i < linksToUpdate.length; i++) {
      const link = linksToUpdate[i];

      // Check if link has required fields
      if (!link.id && link.id !== 0) {
        return NextResponse.json(
          {
            error: `Link at index ${i} is missing id field`,
            code: 'MISSING_LINK_ID'
          },
          { status: 400 }
        );
      }

      if (!link.position && link.position !== 0) {
        return NextResponse.json(
          {
            error: `Link at index ${i} is missing position field`,
            code: 'MISSING_LINK_POSITION'
          },
          { status: 400 }
        );
      }

      // Validate id is a valid integer
      const linkId = parseInt(link.id);
      if (isNaN(linkId)) {
        return NextResponse.json(
          {
            error: `Link at index ${i} has invalid id (must be an integer)`,
            code: 'INVALID_LINK_ID'
          },
          { status: 400 }
        );
      }

      // Validate position is a valid integer
      const position = parseInt(link.position);
      if (isNaN(position)) {
        return NextResponse.json(
          {
            error: `Link at index ${i} has invalid position (must be an integer)`,
            code: 'INVALID_LINK_POSITION'
          },
          { status: 400 }
        );
      }
    }

    // Process all updates
    const updatePromises = linksToUpdate.map(async (link) => {
      const linkId = parseInt(link.id);
      const position = parseInt(link.position);

      // Update the link
      const updated = await db
        .update(links)
        .set({
          position: position,
          updatedAt: new Date().toISOString()
        })
        .where(eq(links.id, linkId))
        .returning();

      return updated;
    });

    // Wait for all updates to complete
    const results = await Promise.all(updatePromises);

    // Count successfully updated links
    const updatedCount = results.filter(result => result.length > 0).length;

    return NextResponse.json(
      {
        success: true,
        message: 'Links reordered successfully',
        updated: updatedCount
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}