import { z } from 'zod';

export const workTypeSchema = z.object({
  _id: z.string(),
  name: z.string(),
  unit: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type WorkType = z.infer<typeof workTypeSchema>;

export const workTypeListSchema = z.array(workTypeSchema);
