import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use Prisma Accelerate if available, otherwise use direct connection
const connectionString = process.env.DATABASE_URL || process.env.PRISMA_ACCELERATE_URL || '';

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: connectionString,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  // Add connection pooling configuration for Vercel
  ...(process.env.NODE_ENV === 'production' && {
    datasources: {
      db: {
        url: connectionString,
      },
    },
  }),
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 