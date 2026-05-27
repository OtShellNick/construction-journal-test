import { z } from 'zod';

/** Zod-схема вида работ. */
export const workTypeSchema = z.object({
  _id: z.string(),
  name: z.string(),
  unit: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/** Тип вида работ. */
export type WorkType = z.infer<typeof workTypeSchema>;

/** Zod-схема списка видов работ. */
export const workTypeListSchema = z.array(workTypeSchema);
