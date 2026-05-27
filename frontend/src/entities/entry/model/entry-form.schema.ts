import { z } from 'zod';

/** Zod-схема формы создания/редактирования записи. */
export const entryFormSchema = z.object({
  date: z.string().min(1, 'Укажите дату'),
  workTypeId: z.string().min(1, 'Выберите вид работ'),
  volume: z
    .number({ error: 'Укажите объём' })
    .min(0.01, 'Объём должен быть больше 0'),
  unit: z.string().min(1, 'Ед. измерения обязательна').max(20),
  executor: z.string().min(2, 'Минимум 2 символа').max(200, 'Максимум 200 символов'),
  notes: z.string().max(500, 'Максимум 500 символов').optional(),
});

/** Тип значений формы создания/редактирования записи. */
export type EntryFormValues = z.infer<typeof entryFormSchema>;
