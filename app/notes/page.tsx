import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes, NOTES_PER_PAGE } from '@/lib/api';
import NotesClient from './Notes.client';

// Список нотаток має бути свіжим на кожен запит, а не зібраним один раз під час білду
export const dynamic = 'force-dynamic';

export default async function Notes() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, ''],
    queryFn: () => fetchNotes({ page: 1, perPage: NOTES_PER_PAGE, search: '' }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}
