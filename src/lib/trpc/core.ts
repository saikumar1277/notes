import { initTRPC } from '@trpc/server';
import { PrismaClient } from '@prisma/client';

const t = initTRPC.context<{ prisma: PrismaClient }>().create();

export const router = t.router;
export const publicProcedure = t.procedure; 