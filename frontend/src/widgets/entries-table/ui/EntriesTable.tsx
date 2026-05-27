import { useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Loader2, Plus } from 'lucide-react';
import { useGetEntriesQuery } from '@/entities/entry';
import type { Entry, QueryEntryDto } from '@/entities/entry';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { EntriesFilters } from './EntriesFilters';
import { EntryFormDialog } from './EntryFormDialog';
import { EntryTableRow } from './EntryTableRow';

type SortField = NonNullable<QueryEntryDto['sort']>;

/** Иконка сортировки для заголовка таблицы. */
function SortIcon({ field, params }: { field: SortField; params: QueryEntryDto }) {
  if (params.sort !== field) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />;
  if (params.order === 'asc') return <ArrowUp className="ml-1 h-3.5 w-3.5" />;
  return <ArrowDown className="ml-1 h-3.5 w-3.5" />;
}

/** Кликабельный заголовок таблицы с поддержкой сортировки. */
function SortableTableHead({
  field,
  label,
  params,
  onSort,
  className,
}: {
  field: SortField;
  label: string;
  params: QueryEntryDto;
  onSort: (f: SortField) => void;
  className?: string;
}) {
  return (
    <TableHead
      className={cn('cursor-pointer select-none hover:text-foreground transition-colors', className)}
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center">
        {label}
        <SortIcon field={field} params={params} />
      </span>
    </TableHead>
  );
}

/** Основной виджет таблицы записей журнала с фильтрацией и сортировкой. */
export function EntriesTable() {
  const [params, setParams] = useState<QueryEntryDto>({});
  const [addOpen, setAddOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const { data, isLoading, isError } = useGetEntriesQuery(params);

  function handleSortClick(field: SortField) {
    if (params.sort === field) {
      setParams((p) => ({ ...p, order: p.order === 'asc' ? 'desc' : 'asc' }));
    } else {
      setParams((p) => ({ ...p, sort: field, order: 'desc' }));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить запись
        </Button>
      </div>

      <EntriesFilters params={params} onChange={setParams} />

      <EntryFormDialog mode="add" open={addOpen} onOpenChange={setAddOpen} />

      {editingEntry && (
        <EntryFormDialog
          mode="edit"
          entry={editingEntry}
          open={!!editingEntry}
          onOpenChange={(o) => { if (!o) setEditingEntry(null); }}
        />
      )}

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHead field="date" label="Дата" params={params} onSort={handleSortClick} className="w-32" />
              <TableHead>Вид работ</TableHead>
              <TableHead className="w-24 text-right">Объём</TableHead>
              <TableHead className="w-24">Ед. изм.</TableHead>
              <SortableTableHead field="executor" label="Исполнитель" params={params} onSort={handleSortClick} />
              <TableHead>Примечания</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </TableCell>
              </TableRow>
            )}

            {isError && (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-destructive">
                  Не удалось загрузить данные. Проверьте подключение к серверу.
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  Записи не найдены
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && data?.map((entry) => (
              <EntryTableRow key={entry._id} entry={entry} onEdit={setEditingEntry} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
