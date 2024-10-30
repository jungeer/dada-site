import { useState, useEffect } from 'react';
import type { DiaryEntry } from '../types';

const STORAGE_KEY = 'dada-diary-entries';

export function useDiaryEntries() {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry: Omit<DiaryEntry, 'id'>) => {
    const newEntry: DiaryEntry = {
      ...entry,
      id: crypto.randomUUID(),
    };
    setEntries(prev => [newEntry, ...prev]);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const updateEntry = (updatedEntry: DiaryEntry) => {
    setEntries(prev =>
      prev.map(entry =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );
  };

  return {
    entries,
    addEntry,
    deleteEntry,
    updateEntry,
  };
}