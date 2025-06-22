# Deployment Fix Guide

## Problem
Your deployment is failing because Prisma is trying to connect to Supabase but the connection string is hardcoded and not properly configured.

## Solution Options

### Option 1: Fix Prisma + Supabase (Recommended for existing setup)

#### Step 1: Update Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Navigate to your project settings
3. Go to the "Environment Variables" section
4. Add these variables:

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ldkttgjtwdmuvourtlqd.supabase.co:5432/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ldkttgjtwdmuvourtlqd.supabase.co:5432/postgres
```

Replace `[YOUR-PASSWORD]` with your actual Supabase database password.

#### Step 2: Get Your Supabase Credentials

1. Go to your Supabase dashboard
2. Navigate to Settings > Database
3. Find your database password
4. Copy the connection strings from the "Connection string" section

#### Step 3: Update Your Database Schema

The Prisma schema has been updated to use environment variables. Make sure your `prisma/schema.prisma` looks like this:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

#### Step 4: Deploy Again

After setting the environment variables in Vercel, redeploy your application.

### Option 2: Switch to Supabase Only (Cleaner approach)

If you want to completely switch to Supabase and remove Prisma/tRPC:

#### Step 1: Replace the Main Page

Replace `src/app/page.tsx` with the Supabase implementation:

```bash
# Backup current page
cp src/app/page.tsx src/app/page-prisma-backup.tsx

# Replace with Supabase version
cp src/app/supabase-notes/page.tsx src/app/page.tsx
```

#### Step 2: Update Environment Variables

Add only the Supabase variables to Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://ldkttgjtwdmuvourtlqd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
```

#### Step 3: Remove Prisma Dependencies (Optional)

If you want to completely remove Prisma:

```bash
npm uninstall @prisma/client prisma
npm uninstall @trpc/client @trpc/next @trpc/react-query @trpc/server @tanstack/react-query
```

#### Step 4: Update Build Script

Update `package.json` build script:

```json
{
  "scripts": {
    "build": "next build"
  }
}
```

## Quick Fix for Immediate Deployment

If you want to deploy immediately without changing your main page:

### Step 1: Set Environment Variables in Vercel

Add these to your Vercel environment variables:

```
DATABASE_URL=postgresql://postgres:wZfC1647aNNnK2M7@db.ldkttgjtwdmuvourtlqd.supabase.co:5432/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:wZfC1647aNNnK2M7@db.ldkttgjtwdmuvourtlqd.supabase.co:5432/postgres
```

### Step 2: Redeploy

The deployment should now work with your existing Prisma setup.

## Verification Steps

1. **Check Environment Variables**: Make sure they're set in Vercel
2. **Test Locally**: Run `npm run build` locally to ensure it works
3. **Check Supabase**: Ensure your Supabase database is running
4. **Monitor Logs**: Check Vercel deployment logs for any remaining errors

## Common Issues and Solutions

### Issue: "Can't reach database server"
- **Solution**: Check if your Supabase database is paused. Go to Supabase dashboard and resume it if needed.

### Issue: "Invalid connection string"
- **Solution**: Make sure the password in your connection string is correct.

### Issue: "Prisma schema not found"
- **Solution**: Ensure the `prisma/schema.prisma` file is committed to your repository.

### Issue: "Environment variables not loading"
- **Solution**: Restart your Vercel deployment after adding environment variables.

## Next Steps

1. Choose your preferred option (Prisma + Supabase or Supabase only)
2. Set the appropriate environment variables in Vercel
3. Redeploy your application
4. Test the functionality

## Support

If you continue to have issues:
1. Check the Vercel deployment logs
2. Verify your Supabase database is running
3. Ensure all environment variables are correctly set
4. Test the connection locally first 