import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/lib/trpc/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({
      prisma,
    }),
  });

export { handler as GET, handler as POST }; 