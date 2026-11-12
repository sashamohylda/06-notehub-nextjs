'use client';

import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes, NOTES_PER_PAGE } from '@/lib/api';
import Loader from '@/components/Loader/Loader';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import css from './NotesPage.module.css';

export default function NotesClient() {
  const [page, setPage] = useState(1);
  // inputValue — що бачить користувач у полі (оновлюється на кожен символ)
  const [inputValue, setInputValue] = useState('');
  // search — що йде в запит (оновлюється із затримкою)
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const updateSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    updateSearch(value);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes({ page, perPage: NOTES_PER_PAGE, search }),
    placeholderData: keepPreviousData,
    // Помилку отримує app/notes/error.tsx
    throwOnError: true,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onChange={handleSearchChange} />
        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <button type="button" className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {data && data.notes.length === 0 && (
        <p className={css.empty}>
          {search ? `No notes found for "${search}"` : 'You have no notes yet'}
        </p>
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}
