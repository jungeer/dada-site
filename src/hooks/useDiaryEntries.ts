import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { DiaryEntry, NewDiaryEntry } from "../types";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type DiaryEntryPayload = RealtimePostgresChangesPayload<DiaryEntry>;

export function useDiaryEntries() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("diary_entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setEntries(data || []);
    } catch (error) {
      console.error("Error loading entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();

    const channel = supabase
      .channel("diary_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "diary_entries",
        },
        (payload: DiaryEntryPayload) => {
          if (payload.eventType === "INSERT") {
            setEntries((prev) => [payload.new as DiaryEntry, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setEntries((prev) =>
              prev.filter((entry) => entry.id !== payload.old.id)
            );
          } else if (payload.eventType === "UPDATE") {
            setEntries((prev) =>
              prev.map((entry) =>
                entry.id === payload.new.id
                  ? (payload.new as DiaryEntry)
                  : entry
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addEntry = async (entry: NewDiaryEntry) => {
    try {
      const { error } = await supabase.from("diary_entries").insert([entry]);
      if (error) throw error;
      await loadEntries();
      return { success: true };
    } catch (error) {
      console.error("Error adding entry:", error);
      return { success: false, error };
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from("diary_entries")
        .delete()
        .eq("id", id);
      if (error) throw error;
      await loadEntries();
      return { success: true };
    } catch (error) {
      console.error("Error deleting entry:", error);
      return { success: false, error };
    }
  };

  const updateEntry = async (updatedEntry: DiaryEntry) => {
    try {
      const { error } = await supabase
        .from("diary_entries")
        .update(updatedEntry)
        .eq("id", updatedEntry.id);
      if (error) throw error;
      await loadEntries();
      return { success: true };
    } catch (error) {
      console.error("Error updating entry:", error);
      return { success: false, error };
    }
  };

  return {
    entries,
    isLoading,
    addEntry,
    deleteEntry,
    updateEntry,
  };
}
