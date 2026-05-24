import { z } from 'zod';

const populatedWorkTypeSchema = z.object({
  _id: z.string(),
  name: z.string(),
  unit: z.string(),
});

export const entrySchema = z.object({
  _id: z.string(),
  date: z.string(),
  workTypeId: z.union([populatedWorkTypeSchema, z.string()]),
  volume: z.number(),
  unit: z.string(),
  executor: z.string(),
  notes: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Entry = z.infer<typeof entrySchema>;

export const entryListSchema = z.array(entrySchema);

export const createEntrySchema = z.object({
  date: z.string().min(1),
  workTypeId: z.string().min(1),
  volume: z.number().min(0.01),
  unit: z.string().min(1).max(20),
  executor: z.string().min(2).max(200),
  notes: z.string().max(500).optional(),
});

export type CreateEntryDto = z.infer<typeof createEntrySchema>;

export const queryEntrySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  sort: z.enum(['date', 'executor']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export type QueryEntryDto = z.infer<typeof queryEntrySchema>;
