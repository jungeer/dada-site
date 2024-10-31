import { useState, useEffect } from "react";

const DEFAULT_BG =
  "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=3270";
const STORAGE_KEY = "dada-background-image";

export function useBackgroundImage() {
  const [backgroundImage, setBackgroundImage] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored || DEFAULT_BG;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, backgroundImage);
  }, [backgroundImage]);

  const updateBackgroundImage = (imageUrl: string) => {
    setBackgroundImage(imageUrl);
  };

  return {
    backgroundImage,
    updateBackgroundImage,
  };
}
