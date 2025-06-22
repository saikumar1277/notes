import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20) + '...');
    
    // Test the database connection
    console.log('Attempting to connect to database...');
    await prisma.$connect();
    console.log('Successfully connected to database');
    
    // Try a simple query
    console.log('Attempting to count notes...');
    const noteCount = await prisma.note.count();
    console.log('Note count:', noteCount);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      noteCount,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
      databaseUrlPreview: process.env.DATABASE_URL ? 
        `${process.env.DATABASE_URL.substring(0, 20)}...` : 'Not set'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    
    // More detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: errorMessage,
      errorStack: errorStack?.split('\n').slice(0, 5), // First 5 lines of stack trace
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
      databaseUrlPreview: process.env.DATABASE_URL ? 
        `${process.env.DATABASE_URL.substring(0, 20)}...` : 'Not set',
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting:', disconnectError);
    }
  }
} 