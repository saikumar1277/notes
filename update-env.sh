#!/bin/bash

echo "🔧 Updating local environment configuration..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create it first."
    exit 1
fi

# Add DIRECT_URL if it doesn't exist
if ! grep -q "DIRECT_URL" .env; then
    echo "📝 Adding DIRECT_URL to .env file..."
    echo 'DIRECT_URL="postgresql://postgres:wZfC1647aNNnK2M7@db.ldkttgjtwdmuvourtlqd.supabase.co:5432/postgres"' >> .env
    echo "✅ DIRECT_URL added to .env file"
else
    echo "✅ DIRECT_URL already exists in .env file"
fi

echo ""
echo "🎯 Next steps for Vercel deployment:"
echo "1. Go to your Vercel dashboard"
echo "2. Navigate to Project Settings > Environment Variables"
echo "3. Add these variables:"
echo "   - DATABASE_URL: postgresql://postgres:wZfC1647aNNnK2M7@db.ldkttgjtwdmuvourtlqd.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1&pool_timeout=20"
echo "   - DIRECT_URL: postgresql://postgres:wZfC1647aNNnK2M7@db.ldkttgjtwdmuvourtlqd.supabase.co:5432/postgres"
echo "   - NEXT_PUBLIC_SUPABASE_URL: https://ldkttgjtwdmuvourtlqd.supabase.co"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY: [your-anon-key]"
echo "4. Redeploy your application"
echo ""
echo "📖 See VERCEL_PRODUCTION_SETUP.md for detailed instructions" 