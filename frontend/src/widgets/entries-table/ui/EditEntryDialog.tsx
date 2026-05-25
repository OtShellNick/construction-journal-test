import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useUpdateEntryMutation } from '@/entities/entry';
import type { Entry } from '@/entities/entry';
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
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { DatePicker } from '@/shared/ui/date-picker';

const formSchema = z.object({
  date: z.string().min(1, 'Укажите дату'),
  workTypeId: z.string().min(1, 'Выберите вид работ'),
  volume: z
    .number({ error: 'Укажите объём' })
    .min(0.01, 'Объём должен быть больше 0'),
  unit: z.string().min(1, 'Ед. измерения обязательна').max(20),
  executor: z.string().min(2, 'Минимум 2 символа').max(200, 'Максимум 200 символов'),
  notes: z.string().max(500, 'Максимум 500 символов').optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: Entry;
}

function getWorkTypeId(workTypeId: Entry['workTypeId']): string {
  if (typeof workTypeId === 'object' && workTypeId !== null) {
    return workTypeId._id;
  }
  return workTypeId;
}

export function EditEntryDialog({ open, onOpenChange, entry }: EditEntryDialogProps) {
  const { data: workTypes } = useGetWorkTypesQuery();
  const [updateEntry, { isLoading }] = useUpdateEntryMutation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      date: entry.date.slice(0, 10),
      workTypeId: getWorkTypeId(entry.workTypeId),
      volume: entry.volume,
      unit: entry.unit,
      executor: entry.executor,
      notes: entry.notes ?? '',
    },
  });

  useEffect(() => {
    reset({
      date: entry.date.slice(0, 10),
      workTypeId: getWorkTypeId(entry.workTypeId),
      volume: entry.volume,
      unit: entry.unit,
      executor: entry.executor,
      notes: entry.notes ?? '',
    });
  }, [entry, reset]);

  const selectedWorkTypeId = watch('workTypeId');

  useEffect(() => {
    const wt = workTypes?.find((w) => w._id === selectedWorkTypeId);
    if (wt) setValue('unit', wt.unit, { shouldValidate: true });
  }, [selectedWorkTypeId, workTypes, setValue]);

  function handleClose() {
    if (isLoading) return;
    onOpenChange(false);
  }

  async function onSubmit(data: FormValues) {
    try {
      await updateEntry({ id: entry._id, body: data }).unwrap();
      toast.success('Запись обновлена');
      onOpenChange(false);
    } catch {
      toast.error('Не удалось обновить запись');
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent
        showCloseButton={!isLoading}
        onEscapeKeyDown={(e) => { if (isLoading) e.preventDefault(); }}
        onInteractOutside={(e) => { if (isLoading) e.preventDefault(); }}
        className="sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle>Редактировать запись</DialogTitle>
          <DialogDescription>Измените поля и нажмите «Сохранить»</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Дата</Label>
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
            {errors.date && (
              <p className="text-xs text-destructive">{errors.date.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Вид работ</Label>
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
            {errors.workTypeId && (
              <p className="text-xs text-destructive">{errors.workTypeId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Объём</Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                {...register('volume', { valueAsNumber: true })}
              />
              {errors.volume && (
                <p className="text-xs text-destructive">{errors.volume.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Ед. изм.</Label>
              <Input
                readOnly
                placeholder="—"
                className="bg-muted text-muted-foreground cursor-default"
                {...register('unit')}
              />
              {errors.unit && (
                <p className="text-xs text-destructive">{errors.unit.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Исполнитель</Label>
            <Input placeholder="Иванов Иван Иванович" {...register('executor')} />
            {errors.executor && (
              <p className="text-xs text-destructive">{errors.executor.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>
              Примечания{' '}
              <span className="text-muted-foreground font-normal">(необязательно)</span>
            </Label>
            <Textarea
              placeholder="Дополнительная информация..."
              rows={3}
              {...register('notes')}
            />
            {errors.notes && (
              <p className="text-xs text-destructive">{errors.notes.message}</p>
            )}
          </div>

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
