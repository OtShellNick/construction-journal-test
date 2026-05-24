import { Button } from '@/shared/ui/button';
import { DatePicker } from '@/shared/ui/date-picker';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import type { QueryEntryDto } from '@/entities/entry';

interface EntriesFiltersProps {
  params: QueryEntryDto;
  onChange: (params: QueryEntryDto) => void;
}

export function EntriesFilters({ params, onChange }: EntriesFiltersProps) {
  const hasFilters = params.from || params.to || params.sort || params.order;

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 bg-card border rounded-lg">
      <div className="flex flex-col gap-1.5">
        <Label>С</Label>
        <DatePicker
          value={params.from}
          onChange={(v) => onChange({ ...params, from: v })}
          placeholder="Начало периода"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>По</Label>
        <DatePicker
          value={params.to}
          onChange={(v) => onChange({ ...params, to: v })}
          placeholder="Конец периода"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Сортировка</Label>
        <Select
          value={params.sort ?? ''}
          onValueChange={(v) =>
            onChange({ ...params, sort: (v as QueryEntryDto['sort']) || undefined })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Поле" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Дата</SelectItem>
            <SelectItem value="executor">Исполнитель</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Порядок</Label>
        <Select
          value={params.order ?? ''}
          onValueChange={(v) =>
            onChange({ ...params, order: (v as QueryEntryDto['order']) || undefined })
          }
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Порядок" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">По убыванию</SelectItem>
            <SelectItem value="asc">По возрастанию</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button variant="outline" onClick={() => onChange({})}>
          Сбросить
        </Button>
      )}
    </div>
  );
}
