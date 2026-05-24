import { useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Loader2 } from 'lucide-react';
import { useGetEntriesQuery } from '@/entities/entry';
import type { QueryEntryDto } from '@/entities/entry';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { cn } from '@/shared/lib/utils';
import { EntriesFilters } from './EntriesFilters';

type SortField = NonNullable<QueryEntryDto['sort']>;

function SortIcon({ field, params }: { field: SortField; params: QueryEntryDto }) {
  if (params.sort !== field) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />;
  if (params.order === 'asc') return <ArrowUp className="ml-1 h-3.5 w-3.5" />;
  return <ArrowDown className="ml-1 h-3.5 w-3.5" />;
}

function formatDate(isoString: string) {
  return new Date(isoString).toLocaleDateString('ru-RU');
}

function getWorkTypeName(workTypeId: unknown): string {
  if (typeof workTypeId === 'object' && workTypeId !== null && 'name' in workTypeId) {
    return String((workTypeId as { name: unknown }).name);
  }
  return '—';
}

export function EntriesTable() {
  const [params, setParams] = useState<QueryEntryDto>({});
  const { data, isLoading, isError } = useGetEntriesQuery(params);

  function handleSortClick(field: SortField) {
    if (params.sort === field) {
      setParams((p) => ({ ...p, order: p.order === 'asc' ? 'desc' : 'asc' }));
    } else {
      setParams((p) => ({ ...p, sort: field, order: 'desc' }));
    }
  }

  const sortableHeadClass =
    'cursor-pointer select-none hover:text-foreground transition-colors';

  return (
    <div className="flex flex-col gap-4">
      <EntriesFilters params={params} onChange={setParams} />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className={cn(sortableHeadClass, 'w-32')}
                onClick={() => handleSortClick('date')}
              >
                <span className="inline-flex items-center">
                  Дата
                  <SortIcon field="date" params={params} />
                </span>
              </TableHead>
              <TableHead>Вид работ</TableHead>
              <TableHead className="w-24 text-right">Объём</TableHead>
              <TableHead className="w-24">Ед. изм.</TableHead>
              <TableHead
                className={cn(sortableHeadClass)}
                onClick={() => handleSortClick('executor')}
              >
                <span className="inline-flex items-center">
                  Исполнитель
                  <SortIcon field="executor" params={params} />
                </span>
              </TableHead>
              <TableHead>Примечания</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </TableCell>
              </TableRow>
            )}

            {isError && (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-destructive">
                  Не удалось загрузить данные. Проверьте подключение к серверу.
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Записи не найдены
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !isError &&
              data?.map((entry) => (
                <TableRow key={entry._id}>
                  <TableCell className="font-medium tabular-nums">
                    {formatDate(entry.date)}
                  </TableCell>
                  <TableCell>{getWorkTypeName(entry.workTypeId)}</TableCell>
                  <TableCell className="text-right tabular-nums">{entry.volume}</TableCell>
                  <TableCell>{entry.unit}</TableCell>
                  <TableCell>{entry.executor}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {entry.notes ?? '—'}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
