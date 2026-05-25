import { useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Loader2, Pencil, Plus } from 'lucide-react';
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
import { AddEntryDialog } from './AddEntryDialog';
import { EditEntryDialog } from './EditEntryDialog';
import { DeleteEntryButton } from './DeleteEntryButton';

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
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
      <div className="flex justify-end">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить запись
        </Button>
      </div>
      
      <EntriesFilters params={params} onChange={setParams} />

      

      <AddEntryDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      {editingEntry && (
        <EditEntryDialog
          open={!!editingEntry}
          onOpenChange={(o) => { if (!o) setEditingEntry(null); }}
          entry={editingEntry}
        />
      )}

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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingEntry(entry)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteEntryButton entryId={entry._id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
