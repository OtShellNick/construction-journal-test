import { useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  useCreateEntryMutation,
  useUpdateEntryMutation,
  entryFormSchema,
} from '@/entities/entry';
import type { Entry, EntryFormValues } from '@/entities/entry';
import { useGetWorkTypesQuery } from '@/entities/work-type';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { DatePicker } from '@/shared/ui/date-picker';
import { FormField } from '@/shared/ui/form-field';

type Mode = 'add' | 'edit';

interface EntryFormDialogProps {
  mode: Mode;
  entry?: Entry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TITLES: Record<Mode, { title: string; description: string }> = {
  add: { title: 'Добавить запись', description: 'Заполните поля и нажмите «Сохранить»' },
  edit: { title: 'Редактировать запись', description: 'Измените поля и нажмите «Сохранить»' },
};

function getDefaultValues(mode: Mode, entry?: Entry): EntryFormValues {
  if (mode === 'edit' && entry) {
    return {
      date: entry.date.slice(0, 10),
      workTypeId: entry.workTypeId._id,
      volume: entry.volume,
      unit: entry.unit,
      executor: entry.executor,
      notes: entry.notes ?? '',
    };
  }
  return { date: '', workTypeId: '', volume: 0.01, unit: '', executor: '', notes: '' };
}

export function EntryFormDialog({ mode, entry, open, onOpenChange }: EntryFormDialogProps) {
  const { data: workTypes } = useGetWorkTypesQuery();
  const [createEntry, { isLoading: isCreating }] = useCreateEntryMutation();
  const [updateEntry, { isLoading: isUpdating }] = useUpdateEntryMutation();
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<EntryFormValues>({
    resolver: zodResolver(entryFormSchema),
    mode: 'onChange',
    defaultValues: getDefaultValues(mode, entry),
  });

  useEffect(() => {
    if (mode === 'edit' && entry) {
      reset(getDefaultValues('edit', entry));
    }
  }, [entry, mode, reset]);

  const selectedWorkTypeId = useWatch({ name: 'workTypeId', control });

  useEffect(() => {
    const wt = workTypes?.find((w) => w._id === selectedWorkTypeId);
    if (wt) setValue('unit', wt.unit, { shouldValidate: true });
  }, [selectedWorkTypeId, workTypes, setValue]);

  function handleClose() {
    if (isLoading) return;
    if (mode === 'add') reset(getDefaultValues('add'));
    onOpenChange(false);
  }

  async function onSubmit(data: EntryFormValues) {
    try {
      if (mode === 'add') {
        await createEntry(data).unwrap();
        toast.success('Запись добавлена');
        reset(getDefaultValues('add'));
      } else if (entry) {
        await updateEntry({ id: entry._id, body: data }).unwrap();
        toast.success('Запись обновлена');
      }
      onOpenChange(false);
    } catch {
      toast.error(mode === 'add' ? 'Не удалось сохранить запись' : 'Не удалось обновить запись');
    }
  }

  const { title, description } = TITLES[mode];

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent
        showCloseButton={!isLoading}
        onEscapeKeyDown={(e) => { if (isLoading) e.preventDefault(); }}
        onInteractOutside={(e) => { if (isLoading) e.preventDefault(); }}
        className="sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="Дата" error={errors.date?.message}>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value || undefined}
                  onChange={(v) => field.onChange(v ?? '')}
                />
              )}
            />
          </FormField>

          <FormField label="Вид работ" error={errors.workTypeId?.message}>
            <Controller
              name="workTypeId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите вид работ" />
                  </SelectTrigger>
                  <SelectContent>
                    {workTypes?.map((wt) => (
                      <SelectItem key={wt._id} value={wt._id}>
                        {wt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Объём" error={errors.volume?.message}>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                {...register('volume', { valueAsNumber: true })}
              />
            </FormField>
            <FormField label="Ед. изм." error={errors.unit?.message}>
              <Input
                readOnly
                placeholder="—"
                className="bg-muted text-muted-foreground cursor-default"
                {...register('unit')}
              />
            </FormField>
          </div>

          <FormField label="Исполнитель" error={errors.executor?.message}>
            <Input placeholder="Иванов Иван Иванович" {...register('executor')} />
          </FormField>

          <FormField label="Примечания" optional error={errors.notes?.message}>
            <Textarea
              placeholder="Дополнительная информация..."
              rows={3}
              {...register('notes')}
            />
          </FormField>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={handleClose}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={!isValid || isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Сохранить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
