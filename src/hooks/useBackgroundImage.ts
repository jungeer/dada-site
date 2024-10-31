import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type SettingsRow = {
  key: string;
  value: string;
  updated_at: string;
};

type SettingsPayload = RealtimePostgresChangesPayload<SettingsRow>;

const DEFAULT_BG =
  "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=3270";

export function useBackgroundImage() {
  const [backgroundImage, setBackgroundImage] = useState(DEFAULT_BG);
  const [isLoading, setIsLoading] = useState(false);

  // 提取加载数据的函数以便复用
  const loadBackgroundImage = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "background_image")
        .single();

      if (error) {
        console.error("Error loading background image:", error);
        return;
      }

      if (data?.value) {
        setBackgroundImage(data.value);
      }
    } catch (error) {
      console.error("Error loading background image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBackgroundImage();

    const channel = supabase
      .channel("settings_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "settings",
          filter: "key=eq.background_image",
        },
        (payload: SettingsPayload) => {
          if (payload.new && "value" in payload.new) {
            setBackgroundImage(payload.new.value);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateBackgroundImage = async (imageUrl: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("settings")
        .upsert(
          { key: "background_image", value: imageUrl },
          { onConflict: "key" }
        );

      if (error) throw error;
      await loadBackgroundImage(); // 刷新数据
      return { success: true };
    } catch (error) {
      console.error("Error updating background image:", error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    backgroundImage,
    isLoading,
    updateBackgroundImage,
  };
}
