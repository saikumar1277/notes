# Vercel Deployment Setup Guide

## Environment Variables Setup

To fix the database connection error, you need to configure the following environment variables in your Vercel project:

### 1. Go to Vercel Dashboard
1. Navigate to your project in the Vercel dashboard
2. Go to Settings → Environment Variables

### 2. Add Environment Variables

Add these environment variables:

**DATABASE_URL**
- Value: Your Supabase connection string
- Format: `postgresql://username:password@host:port/database?pgbouncer=true&connection_limit=1&pool_timeout=20`
- Environment: Production, Preview, Development

**DIRECT_URL** (Optional but recommended)
- Value: Your direct Supabase connection string (without pgbouncer)
- Format: `postgresql://username:password@host:port/database`
- Environment: Production, Preview, Development

### 3. Example Supabase Connection Strings

For Supabase, your connection strings should look like:

**DATABASE_URL (with connection pooling):**
```
postgresql://postgres:[YOUR-PASSWORD]@db.ldkttgjtwdmuvourtlqd.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1&pool_timeout=20
```

**DIRECT_URL (direct connection):**
```
postgresql://postgres:[YOUR-PASSWORD]@db.ldkttgjtwdmuvourtlqd.supabase.co:5432/postgres
```

### 4. Redeploy
After adding the environment variables:
1. Go to Deployments tab
2. Click "Redeploy" on your latest deployment
3. Or push a new commit to trigger a new deployment

### 5. Verify Connection
You can test the database connection by visiting your deployed app and checking if the database operations work correctly.

## Troubleshooting

If you still get connection errors:

1. **Check Supabase Dashboard**: Ensure your database is active and accessible
2. **Verify IP Allowlist**: Make sure Vercel's IPs are allowed in Supabase
3. **Check Connection String**: Ensure the password and database name are correct
4. **Enable Connection Pooling**: In Supabase, go to Settings → Database and enable connection pooling

## Alternative: Use Prisma Accelerate

For better performance, consider using Prisma Accelerate:

1. Install Prisma Accelerate: `npx prisma accelerate init`
2. Add the `PRISMA_ACCELERATE_URL` environment variable to Vercel
3. Update your connection logic to use the accelerate URL when available 