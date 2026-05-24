import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useDeleteEntryMutation } from '@/entities/entry';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';

interface DeleteEntryButtonProps {
  entryId: string;
}

export function DeleteEntryButton({ entryId }: DeleteEntryButtonProps) {
  const [deleteEntry, { isLoading }] = useDeleteEntryMutation();

  async function handleConfirm() {
    try {
      await deleteEntry(entryId).unwrap();
      toast.success('Запись удалена');
    } catch {
      toast.error('Не удалось удалить запись');
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isLoading} className="h-8 w-8 text-muted-foreground hover:text-destructive">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить запись?</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие необратимо. Запись будет удалена навсегда.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Удалить</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
