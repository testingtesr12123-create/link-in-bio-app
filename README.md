# 🔗 Link in Bio Application

A modern, full-featured Link in Bio web application built with Next.js 15, allowing users to create personalized profile pages with multiple external links that can be shared via a single bio link.

## ✨ Features

### 🎨 User Features
- **Custom Profiles**: Create a unique username and personalized bio page
- **Link Management**: Add, edit, delete, and reorder links with drag-and-drop
- **Theme Customization**: Customize colors, fonts, and button styles
- **Profile Customization**: Upload profile images and add bio text
- **Click Analytics**: Track clicks on each link
- **Responsive Design**: Fully responsive on all devices
- **Live Preview**: Real-time preview of your profile as you customize

### 🛠️ Technical Features
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Turso (SQLite)** database with Drizzle ORM
- **Drag-and-Drop** link reordering with @dnd-kit
- **Shadcn/UI** component library
- **Tailwind CSS** for styling
- **RESTful API** routes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Database connection (Turso is already configured)

### Installation

1. Install dependencies:
```bash
bun install
# or
npm install
```

2. The database is already configured with Turso. Environment variables are set in `.env`

3. Run the development server:
```bash
bun dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Application Flow

### 1. Onboarding (`/onboard`)
- New users enter a unique username
- Username validation (lowercase letters, numbers, underscores, hyphens)
- Automatic redirect to dashboard after creation

### 2. Dashboard (`/dashboard/[username]`)
- **Profile Settings**: Update name, bio, and profile image
- **Link Management**: 
  - Add new links with title, URL, and optional icon
  - Edit existing links
  - Delete links with confirmation
  - Reorder links via drag-and-drop
- **Theme Customization**:
  - Background color
  - Button color and text color
  - Button style (rounded, square, pill)
  - Font family (sans-serif, serif, monospace)
- **Live Preview**: See changes in real-time
- **Analytics**: View click counts for each link

### 3. Public Profile (`/[username]`)
- Beautiful, responsive profile page
- Displays profile picture, name, and bio
- Themed link buttons with icons
- Click tracking for analytics
- Share-friendly URL structure

### 4. Settings (`/[username]/settings`)
- Update profile information
- Change profile image URL
- Edit bio text
- Account management options

## 🗄️ Database Schema

### Users Table
- `id`: Auto-increment primary key
- `username`: Unique username (lowercase)
- `name`: Display name
- `bio`: User bio text
- `profileImageUrl`: URL to profile image
- `createdAt`, `updatedAt`: Timestamps

### Themes Table
- `id`: Auto-increment primary key
- `userId`: Foreign key to users
- `backgroundColor`: Hex color
- `buttonColor`: Hex color
- `buttonTextColor`: Hex color
- `buttonStyle`: 'rounded' | 'square' | 'pill'
- `fontFamily`: 'sans' | 'serif' | 'mono'
- `createdAt`, `updatedAt`: Timestamps

### Links Table
- `id`: Auto-increment primary key
- `userId`: Foreign key to users
- `title`: Link title
- `url`: Link URL
- `icon`: Icon name (Lucide icons)
- `position`: Display order
- `isActive`: Boolean flag
- `clicks`: Click count
- `createdAt`, `updatedAt`: Timestamps

## 🔌 API Endpoints

### User Management
- `POST /api/users` - Create new user
- `GET /api/users/[username]` - Get user profile with theme and links
- `PUT /api/users/[username]` - Update user profile

### Link Management
- `POST /api/links` - Create new link
- `PUT /api/links/[id]` - Update link
- `DELETE /api/links/[id]` - Delete link
- `POST /api/links/reorder` - Reorder multiple links
- `POST /api/links/[id]/click` - Track link click

### Theme Management
- `PUT /api/themes/[userId]` - Update or create theme

## 🎨 Customization

### Theme Options
- **Background Color**: Any hex color
- **Button Color**: Any hex color
- **Button Text Color**: Any hex color
- **Button Styles**:
  - Rounded: Modern rounded corners
  - Square: Sharp corners
  - Pill: Fully rounded ends
- **Font Families**:
  - Sans: Clean, modern font
  - Serif: Traditional, elegant font
  - Mono: Monospace, technical font

### Icons
Links support Lucide React icons. Common examples:
- `Globe` - Website
- `Instagram` - Instagram profile
- `Twitter` - Twitter/X profile
- `Github` - GitHub profile
- `Linkedin` - LinkedIn profile
- `Mail` - Email
- `Youtube` - YouTube channel

## 🔒 Security Features
- Username validation and sanitization
- SQL injection prevention via Drizzle ORM
- Input validation on all API endpoints
- Error handling with user-friendly messages

## 📱 Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly drag-and-drop on mobile
- Adaptive layouts and components

## 🚀 Deployment

The application is ready to deploy to Vercel, Netlify, or any Next.js-compatible hosting platform:

1. Push your code to a Git repository
2. Connect to your hosting platform
3. Environment variables are already configured
4. Deploy!

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Database**: Turso (LibSQL/SQLite)
- **ORM**: Drizzle
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **Icons**: Lucide React
- **Drag & Drop**: @dnd-kit
- **Package Manager**: Bun

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

Built with ❤️ using Next.js and modern web technologies.