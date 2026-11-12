'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import css from './NoteDetails.module.css';

export default function NoteDetailsClient() {
  const { id } = useParams<{ id: string }>();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (error || !note) {
    return <p>Something went wrong.</p>;
  }

  // Фіксований часовий пояс: сервер (UTC на Vercel) і браузер мають отримати
  // однаковий текст, інакше React видасть помилку гідратації
  const createdDate = new Date(note.createdAt).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  });

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.tag}>{note.tag}</p>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>Created: {createdDate}</p>
      </div>
    </div>
  );
}
