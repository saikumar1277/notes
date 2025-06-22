import { router } from './core';
import { notesRouter } from './notes';

export const appRouter = router({
  notes: notesRouter,
});

export type AppRouter = typeof appRouter; 