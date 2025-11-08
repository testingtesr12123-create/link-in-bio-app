import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Add users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  name: text('name'),
  bio: text('bio'),
  profileImageUrl: text('profile_image_url'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Add themes table
export const themes = sqliteTable('themes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().unique().references(() => users.id),
  backgroundColor: text('background_color').notNull().default('#ffffff'),
  buttonColor: text('button_color').notNull().default('#000000'),
  buttonTextColor: text('button_text_color').notNull().default('#ffffff'),
  buttonStyle: text('button_style').notNull().default('rounded'),
  fontFamily: text('font_family').notNull().default('sans'),
  profileImageLayout: text('profile_image_layout').notNull().default('classic'),
  titleStyle: text('title_style').notNull().default('text'),
  titleFont: text('title_font').notNull().default('Link Sans'),
  titleColor: text('title_color').notNull().default('#000000'),
  titleSize: text('title_size').notNull().default('small'),
  wallpaper: text('wallpaper').notNull().default('#ffffff'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Add links table
export const links = sqliteTable('links', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  url: text('url').notNull(),
  icon: text('icon'),
  layout: text('layout').default('default'),
  position: integer('position').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  clicks: integer('clicks').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Add profile_views table
export const profileViews = sqliteTable('profile_views', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  viewedAt: text('viewed_at').notNull(),
  referrer: text('referrer'),
  deviceType: text('device_type'),
});

// Add link_clicks table
export const linkClicks = sqliteTable('link_clicks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  linkId: integer('link_id').notNull().references(() => links.id),
  clickedAt: text('clicked_at').notNull(),
  referrer: text('referrer'),
});