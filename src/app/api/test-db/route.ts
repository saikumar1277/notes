import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test the database connection
    await prisma.$connect();
    
    // Try a simple query
    const noteCount = await prisma.note.count();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      noteCount,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 