import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { themes } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Validate userId parameter
    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json(
        { 
          error: 'Valid user ID is required',
          code: 'INVALID_USER_ID' 
        },
        { status: 400 }
      );
    }

    const userIdInt = parseInt(userId);

    // Parse request body
    const body = await request.json();
    const {
      background_color,
      button_color,
      button_text_color,
      button_style,
      font_family,
      profile_image_layout,
      title_style,
      title_font,
      title_color,
      title_size,
      wallpaper
    } = body;

    // Validate button_style if provided
    if (button_style !== undefined) {
      const validButtonStyles = ['rounded', 'square', 'pill'];
      if (!validButtonStyles.includes(button_style)) {
        return NextResponse.json(
          {
            error: `Invalid button style. Must be one of: ${validButtonStyles.join(', ')}`,
            code: 'INVALID_BUTTON_STYLE'
          },
          { status: 400 }
        );
      }
    }

    // Validate font_family if provided
    if (font_family !== undefined) {
      const validFontFamilies = ['sans', 'serif', 'mono'];
      if (!validFontFamilies.includes(font_family)) {
        return NextResponse.json(
          {
            error: `Invalid font family. Must be one of: ${validFontFamilies.join(', ')}`,
            code: 'INVALID_FONT_FAMILY'
          },
          { status: 400 }
        );
      }
    }

    // Validate profile_image_layout if provided
    if (profile_image_layout !== undefined) {
      const validLayouts = ['classic', 'hero'];
      if (!validLayouts.includes(profile_image_layout)) {
        return NextResponse.json(
          {
            error: `Invalid profile image layout. Must be one of: ${validLayouts.join(', ')}`,
            code: 'INVALID_PROFILE_IMAGE_LAYOUT'
          },
          { status: 400 }
        );
      }
    }

    // Validate title_style if provided
    if (title_style !== undefined) {
      const validTitleStyles = ['text', 'logo'];
      if (!validTitleStyles.includes(title_style)) {
        return NextResponse.json(
          {
            error: `Invalid title style. Must be one of: ${validTitleStyles.join(', ')}`,
            code: 'INVALID_TITLE_STYLE'
          },
          { status: 400 }
        );
      }
    }

    // Validate title_size if provided
    if (title_size !== undefined) {
      const validTitleSizes = ['small', 'large'];
      if (!validTitleSizes.includes(title_size)) {
        return NextResponse.json(
          {
            error: `Invalid title size. Must be one of: ${validTitleSizes.join(', ')}`,
            code: 'INVALID_TITLE_SIZE'
          },
          { status: 400 }
        );
      }
    }

    // Validate color fields if provided
    const validateHexColor = (color: string, fieldName: string) => {
      if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
        return {
          valid: false,
          error: `Invalid ${fieldName}. Must be a valid hex color (e.g., #ffffff)`,
          code: 'INVALID_COLOR_FORMAT'
        };
      }
      return { valid: true };
    };

    if (background_color !== undefined) {
      const validation = validateHexColor(background_color, 'background color');
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error, code: validation.code },
          { status: 400 }
        );
      }
    }

    if (button_color !== undefined) {
      const validation = validateHexColor(button_color, 'button color');
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error, code: validation.code },
          { status: 400 }
        );
      }
    }

    if (button_text_color !== undefined) {
      const validation = validateHexColor(button_text_color, 'button text color');
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error, code: validation.code },
          { status: 400 }
        );
      }
    }

    if (title_color !== undefined) {
      const validation = validateHexColor(title_color, 'title color');
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error, code: validation.code },
          { status: 400 }
        );
      }
    }

    if (wallpaper !== undefined) {
      const validation = validateHexColor(wallpaper, 'wallpaper');
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error, code: validation.code },
          { status: 400 }
        );
      }
    }

    // Check if theme exists for this userId
    const existingTheme = await db.select()
      .from(themes)
      .where(eq(themes.userId, userIdInt))
      .limit(1);

    if (existingTheme.length > 0) {
      // Theme exists - update only provided fields
      const updateData: any = {
        updatedAt: new Date().toISOString()
      };

      if (background_color !== undefined) {
        updateData.backgroundColor = background_color;
      }
      if (button_color !== undefined) {
        updateData.buttonColor = button_color;
      }
      if (button_text_color !== undefined) {
        updateData.buttonTextColor = button_text_color;
      }
      if (button_style !== undefined) {
        updateData.buttonStyle = button_style;
      }
      if (font_family !== undefined) {
        updateData.fontFamily = font_family;
      }
      if (profile_image_layout !== undefined) {
        updateData.profileImageLayout = profile_image_layout;
      }
      if (title_style !== undefined) {
        updateData.titleStyle = title_style;
      }
      if (title_font !== undefined) {
        updateData.titleFont = title_font;
      }
      if (title_color !== undefined) {
        updateData.titleColor = title_color;
      }
      if (title_size !== undefined) {
        updateData.titleSize = title_size;
      }
      if (wallpaper !== undefined) {
        updateData.wallpaper = wallpaper;
      }

      const updatedTheme = await db.update(themes)
        .set(updateData)
        .where(eq(themes.userId, userIdInt))
        .returning();

      return NextResponse.json(updatedTheme[0], { status: 200 });
    } else {
      // Theme does not exist - create new theme
      const now = new Date().toISOString();
      
      const newThemeData = {
        userId: userIdInt,
        backgroundColor: background_color ?? '#ffffff',
        buttonColor: button_color ?? '#000000',
        buttonTextColor: button_text_color ?? '#ffffff',
        buttonStyle: button_style ?? 'rounded',
        fontFamily: font_family ?? 'sans',
        profileImageLayout: profile_image_layout ?? 'classic',
        titleStyle: title_style ?? 'text',
        titleFont: title_font ?? 'Link Sans',
        titleColor: title_color ?? '#000000',
        titleSize: title_size ?? 'small',
        wallpaper: wallpaper ?? '#ffffff',
        createdAt: now,
        updatedAt: now
      };

      const newTheme = await db.insert(themes)
        .values(newThemeData)
        .returning();

      return NextResponse.json(newTheme[0], { status: 200 });
    }
  } catch (error) {
    console.error('PUT /api/themes/[userId] error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error as Error).message 
      },
      { status: 500 }
    );
  }
}