import React, { useState, useEffect, useRef } from "react";
import { Trash2, Edit } from "lucide-react";
import type { DiaryEntry as DiaryEntryType } from "../types";

interface DiaryEntryProps {
  entry: DiaryEntryType;
  onDelete?: (id: string) => void;
  onEdit?: (entry: DiaryEntryType) => void;
  className?: string;
}

export default function DiaryEntry({
  entry,
  onDelete,
  onEdit,
  className = "",
}: DiaryEntryProps) {
  const [imageHeight, setImageHeight] = useState<number>(0);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (entry.image && imageRef.current) {
      const img = new Image();
      img.src = entry.image;
      img.onload = () => {
        const aspectRatio = img.height / img.width;
        setImageHeight(imageRef.current!.offsetWidth * aspectRatio);
      };
    }
  }, [entry.image]);

  const formattedDate = new Date(entry.created_at).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition break-inside-avoid ${className}`}
      style={{ breakInside: "avoid" }}
    >
      {entry.image && (
        <div
          className="relative w-full overflow-hidden"
          style={{ height: imageHeight || "auto" }}
        >
          <img
            ref={imageRef}
            src={entry.image}
            alt={entry.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-1">{entry.title}</h3>
            <p className="text-gray-500 text-sm">{formattedDate}</p>
          </div>
          {(onEdit || onDelete) && (
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(entry)}
                  className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100 transition"
                  aria-label="编辑"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(entry.id)}
                  className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100 transition"
                  aria-label="删除"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>
        <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
      </div>
    </div>
  );
}
