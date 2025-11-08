import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const linkId = parseInt(id);

    const body = await request.json();

    // Check if link exists
    const existingLink = await db
      .select()
      .from(links)
      .where(eq(links.id, linkId))
      .limit(1);

    if (existingLink.length === 0) {
      return NextResponse.json(
        { error: 'Link not found', code: 'LINK_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Validate layout if provided
    if (body.layout !== undefined && body.layout !== null) {
      const validLayouts = ['default', 'icon-only', 'thumbnail', 'card', 'minimal', 'featured'];
      if (!validLayouts.includes(body.layout)) {
        return NextResponse.json(
          { 
            error: `layout must be one of: ${validLayouts.join(', ')}`,
            code: 'INVALID_LAYOUT'
          },
          { status: 400 }
        );
      }
    }

    // Build update object with only provided fields
    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (body.title !== undefined) {
      updates.title = body.title.trim();
    }

    if (body.url !== undefined) {
      updates.url = body.url.trim();
    }

    if (body.icon !== undefined) {
      updates.icon = body.icon;
    }

    if (body.layout !== undefined) {
      updates.layout = body.layout;
    }

    if (body.position !== undefined) {
      updates.position = body.position;
    }

    if (body.is_active !== undefined) {
      updates.isActive = body.is_active;
    }

    // Update the link
    const updatedLink = await db
      .update(links)
      .set(updates)
      .where(eq(links.id, linkId))
      .returning();

    if (updatedLink.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update link', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedLink[0], { status: 200 });
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
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
        { error: 'Link not found', code: 'LINK_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete the link
    const deletedLink = await db
      .delete(links)
      .where(eq(links.id, linkId))
      .returning();

    if (deletedLink.length === 0) {
      return NextResponse.json(
        { error: 'Failed to delete link', code: 'DELETE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Link deleted successfully',
        id: linkId,
        deletedLink: deletedLink[0],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}