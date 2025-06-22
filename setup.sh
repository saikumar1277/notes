#!/bin/bash

echo "🚀 Setting up Notes App..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    echo 'DATABASE_URL="mongodb://localhost:27017/notes-app"' > .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

echo ""

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start MongoDB (local or cloud)"
echo "2. Update .env with your MongoDB connection string"
echo "3. Run: npx prisma db push"
echo "4. Run: npm run dev"
echo "5. Open http://localhost:3000"
echo ""
echo "For MongoDB Atlas (cloud):"
echo "- Create account at https://www.mongodb.com/atlas"
echo "- Create a cluster and get your connection string"
echo "- Update DATABASE_URL in .env"
echo ""
echo "For local MongoDB with Docker:"
echo "docker run -d -p 27017:27017 --name mongodb mongo:latest" 