# Mi Gente LSCC Student Organization Website

A comprehensive web platform for the Mi Gente LSCC student group at the University of Minnesota, designed to showcase events, board members, and organization information.

## Project Overview

This website serves as the digital hub for Mi Gente, providing:
- Public-facing information about the organization
- Event listings with details, images, and external links
- Board member profiles with photos and positions
- RSVP functionality for upcoming events
- Administrative controls for content management

## Features

### Public Features

#### Homepage
- Organization description and mission statement
- Featured images showcasing group activities
- Quick links to important sections

#### Events Page
- List of upcoming and past events
- Filtering options (upcoming, past, all)
- Event details including date, time, location, and description
- Event images with automatic resizing and compression
- External links for additional information or registration
- RSVP functionality for interested attendees

#### Board Page
- Profiles of all board members
- Member photos displayed in consistent circular format
- Positions and optional biographical information
- Customizable display order for organizational hierarchy

### Administrative Features

#### Authentication System
- Secure admin login with email and password
- Session management with JWT tokens
- Role-based access control

#### Dashboard
- Overview of all managed content
- Quick access to administrative functions

#### Event Management
- Create, edit, and delete events
- Image upload with automatic compression and resizing
- Scheduling tools with date and time functionality
- External link integration
- View and export event attendee lists

#### Board Member Management
- Add, edit, and remove board member profiles
- Photo upload with automatic formatting
- Position and biographical information
- Control display order on the public board page

## Technology Stack

### Frontend
- **React**: Component-based UI development
- **Next.js**: Server-side rendering, routing, and API routes
- **Tailwind CSS**: Utility-first styling framework
- **React Hook Form**: Form validation and submission
- **React Icons**: Icon library for enhanced UI

### Backend
- **Next.js API Routes**: Serverless functions for backend logic
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: MongoDB object modeling
- **NextAuth.js**: Authentication framework with JWT support
- **bcryptjs**: Password hashing for security

### Media Processing
- **Formidable**: Multipart form parsing for file uploads
- **Sharp**: Image processing library for resizing and compression

### Development Tools
- **ESLint**: Code linting for quality control
- **PostCSS**: CSS processing with plugins
- **Autoprefixer**: Automatic vendor prefix addition

## Database Schema

### Users
- ID
- Name
- Email
- Password (hashed)
- Role
- Creation date

### Events
- ID
- Title
- Description
- Date
- Time
- Location
- Image URL
- External link
- Creation date

### RSVPs
- ID
- Event ID (reference)
- Name
- Email
- Creation date

### Board Members
- ID
- Name
- Position
- Image URL
- Bio (optional)
- Display order
- Creation date

## API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - Handles all authentication requests

### Events
- `GET /api/events` - Retrieve all events
- `POST /api/events` - Create a new event (admin only)
- `GET /api/events/:id` - Retrieve a specific event
- `PUT /api/events/:id` - Update an event (admin only)
- `DELETE /api/events/:id` - Delete an event (admin only)
- `POST /api/events/rsvp` - Submit an RSVP for an event

### Board Members
- `GET /api/board-members` - Retrieve all board members
- `POST /api/board-members` - Create a new board member (admin only)
- `GET /api/board-members/:id` - Retrieve a specific board member
- `PUT /api/board-members/:id` - Update a board member (admin only)
- `DELETE /api/board-members/:id` - Delete a board member (admin only)

### Utilities
- `POST /api/upload/image` - Upload and process images (admin only)
- `GET /api/admin/attendees` - Retrieve attendees for an event (admin only)

## Screenshots

Interface
![Homepage](public/screenshots/homepage.png)

![About](public/screenshots/about.png)

![Events](public/screenshots/events.png)

![Board](public/screenshots/board.png)

![RSVP](public/screenshots/RSVP.png)

![Admin Dashboard](public/screenshots/Admin Dashboard.png)

## Installation and Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- MongoDB Atlas account

### Local Development Setup

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/mi-gente-website.git
   cd mi-gente-website
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables by creating a `.env.local` file:
   ```
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.example.mongodb.net/mi-gente
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_key
   ADMIN_EMAIL=admin@migente.org
   ADMIN_PASSWORD=your_secure_password
   ```

4. Create required directories
   ```bash
   mkdir -p public/images
   mkdir -p public/uploads
   touch public/uploads/.gitkeep
   ```

5. Create the admin user using the provided seed script
   ```bash
   node seed.js
   ```

6. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

7. Access the site at `http://localhost:3000`

## Deployment

This application is optimized for deployment on Vercel:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Configure environment variables in the Vercel dashboard
4. Deploy the application

Alternative deployment options include Netlify, AWS Amplify, or any platform supporting Next.js applications.

## Project Structure

```
mi-gente-website/
├── public/               # Static assets
│   ├── images/           # Static images
│   └── uploads/          # User-uploaded images
├── src/                  # Source code
│   ├── components/       # Reusable UI components
│   ├── models/           # MongoDB models
│   ├── pages/            # Next.js pages and API routes
│   │   ├── admin/        # Admin dashboard and management pages
│   │   ├── api/          # API endpoints
│   │   ├── board/        # Board member pages
│   │   └── events/       # Event pages
│   ├── styles/           # CSS styles
│   └── utils/            # Utility functions
├── .env.local            # Environment variables
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies
└── tailwind.config.js    # Tailwind CSS configuration
```

## Security Considerations

- Passwords are hashed using bcryptjs before storage
- JWT tokens for authentication expire after 30 days
- Admin-only routes check authentication status on both client and server
- Form validation is performed on both client and server sides
- Uploaded images are processed and stored securely

## Performance Optimizations

- Images are automatically resized and compressed for optimal loading speed
- NextAuth.js provides efficient authentication handling
- Server-side rendering for improved SEO and initial page load
- MongoDB indexes for optimized queries
- Responsive design for all device sizes

## Extensibility

The application architecture allows for future extensions such as:
- Blog or news section
- Photo gallery
- Member-only content
- Events calendar view
- Integration with social media