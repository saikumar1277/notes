# Supabase Integration Setup Guide

This guide will help you integrate Supabase with your weekNotes application, replacing the current Prisma/tRPC setup.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. Your existing weekNotes project

## Step 1: Create a Supabase Project

1. Go to [database.new](https://database.new) and create a new Supabase project
2. Wait for your project to be set up (this may take a few minutes)
3. Note down your project URL and anon key (you'll find these in Settings > API)

## Step 2: Set Up the Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `supabase-schema.sql` into the editor
3. Run the SQL to create the notes table and sample data

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Replace the placeholder values with your actual Supabase project URL and anon key.

## Step 4: Install Dependencies

The required dependencies have already been installed:
- `@supabase/supabase-js` - Supabase JavaScript client
- `@supabase/ssr` - Supabase Server-Side Rendering utilities

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit the following pages to test the integration:
   - `/instruments` - Basic Supabase query example
   - `/supabase-notes` - Full notes application using Supabase

## File Structure

The following files have been created for the Supabase integration:

```
src/
├── utils/
│   └── supabase/
│       ├── client.ts      # Client-side Supabase client
│       └── server.ts      # Server-side Supabase client
├── middleware.ts          # Supabase middleware for auth
└── app/
    ├── instruments/
    │   └── page.tsx       # Basic Supabase example
    └── supabase-notes/
        └── page.tsx       # Full notes app with Supabase
```

## Key Features Implemented

### 1. Server-Side Rendering Support
- `src/utils/supabase/server.ts` - For server components and API routes
- `src/utils/supabase/client.ts` - For client components

### 2. Authentication Middleware
- `src/middleware.ts` - Handles authentication and session management

### 3. Database Operations
The Supabase notes page demonstrates:
- **Create**: Add new notes with title, content, and date
- **Read**: Fetch and display notes for specific days
- **Update**: Edit note content and toggle completion status
- **Delete**: Remove notes from the database

### 4. Real-time Features
Supabase provides real-time subscriptions out of the box. You can extend the application to include:
- Real-time note updates across multiple users
- Live collaboration features
- Instant notifications

## Migration from Prisma/tRPC

If you want to completely migrate from Prisma/tRPC to Supabase:

1. **Remove Prisma dependencies**:
   ```bash
   npm uninstall @prisma/client prisma
   ```

2. **Remove tRPC dependencies**:
   ```bash
   npm uninstall @trpc/client @trpc/next @trpc/react-query @trpc/server @tanstack/react-query
   ```

3. **Update your main page** (`src/app/page.tsx`) to use the Supabase implementation from `supabase-notes/page.tsx`

4. **Remove Prisma schema** and related files

## Security Considerations

1. **Row Level Security (RLS)**: The schema includes basic RLS policies. You should customize these based on your authentication requirements.

2. **Environment Variables**: Never commit your `.env.local` file to version control.

3. **API Keys**: The anon key is safe to use in client-side code, but the service role key should only be used in server-side code.

## Next Steps

1. **Authentication**: Implement user authentication using Supabase Auth
2. **Real-time**: Add real-time subscriptions for live updates
3. **Storage**: Use Supabase Storage for file uploads
4. **Edge Functions**: Create serverless functions for complex operations

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure your `.env.local` file is in the project root
   - Restart your development server after adding environment variables

2. **Database Connection Errors**
   - Verify your Supabase URL and anon key are correct
   - Check that your database is online in the Supabase dashboard

3. **RLS Policy Errors**
   - Ensure RLS policies are properly configured for your use case
   - Check the Supabase logs for detailed error messages

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## Example Usage

Here's a quick example of how to use Supabase in your components:

```typescript
import { createClient } from '@/utils/supabase/client'

// In a client component
const supabase = createClient()

// Fetch data
const { data, error } = await supabase
  .from('notes')
  .select('*')
  .order('created_at', { ascending: false })

// Insert data
const { data, error } = await supabase
  .from('notes')
  .insert([{ title: 'New Note', content: 'Note content' }])
  .select()
```

The integration is now complete! You can start using Supabase for your notes application. 