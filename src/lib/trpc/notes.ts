import { z } from 'zod';
import { publicProcedure, router } from './core';

export const notesRouter = router({
  
    getAll: publicProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.note.findMany({
    
        orderBy: { createdAt: 'asc' },
      });
    }),
  
    create: publicProcedure
      .input(
        z.object({
          title: z.string().optional(),
          content: z.string().min(1, 'Content is required'),
          day: z.string().optional(),
          month: z.string().optional(),
          year: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return await ctx.prisma.note.create({
          data: input,
        });
      }),
  
    update: publicProcedure
      .input(
        z.object({
          id: z.string(),
          title: z.string().optional(),
          content: z.string().optional(),
          day: z.string().optional(),
          month: z.string().optional(),
          year: z.string().optional(),
          iscomplete: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return await ctx.prisma.note.update({
          where: { id: input.id },
          data: {
            title: input.title,
            content: input.content,
            iscomplete: input.iscomplete,
            day: input.day,
            month: input.month,
            year: input.year,
          },
        });
      }),
  
    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        return await ctx.prisma.note.delete({
          where: { id: input.id },
        });
      }),
  });