import { Pencil } from 'lucide-react';
import type { Entry } from '@/entities/entry';
import { TableCell, TableRow } from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { DeleteEntryButton } from './DeleteEntryButton';

function formatDate(isoString: string) {
  return new Date(isoString).toLocaleDateString('ru-RU');
}

interface EntryTableRowProps {
  entry: Entry;
  onEdit: (entry: Entry) => void;
}

export function EntryTableRow({ entry, onEdit }: EntryTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium tabular-nums">
        {formatDate(entry.date)}
      </TableCell>
      <TableCell>{entry.workTypeId.name}</TableCell>
      <TableCell className="text-right tabular-nums">{entry.volume}</TableCell>
      <TableCell>{entry.unit}</TableCell>
      <TableCell>{entry.executor}</TableCell>
      <TableCell className="text-muted-foreground">
        {entry.notes ?? '—'}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(entry)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteEntryButton entryId={entry._id} />
        </div>
      </TableCell>
    </TableRow>
  );
}
