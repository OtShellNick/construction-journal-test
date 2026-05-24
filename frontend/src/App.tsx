import { EntriesTableWidget } from '@/widgets/entries-table';
import { Toaster } from '@/shared/ui/sonner';

export default function App() {
  return (
    <>
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Журнал выполненных работ</h1>
        <EntriesTableWidget />
      </main>
      <Toaster richColors position="top-right" />
    </>
  );
}
