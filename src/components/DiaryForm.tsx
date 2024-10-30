import React, { useState } from 'react';
import { PlusCircle, Image as ImageIcon } from 'lucide-react';
import type { DiaryEntry, ImageUploadResult } from '../types';

interface DiaryFormProps {
  onSubmit: (entry: Omit<DiaryEntry, 'id'>) => void;
}

export default function DiaryForm({ onSubmit }: DiaryFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string>();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSubmit({
      date: new Date().toISOString(),
      title: title.trim(),
      content: content.trim(),
      image,
    });

    setTitle('');
    setContent('');
    setImage(undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entry Title"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What did DaDa do today?"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
          required
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition">
          <ImageIcon className="w-5 h-5" />
          <span>Add Photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
        {image && <span className="text-green-600">Image selected ✓</span>}
      </div>

      <button
        type="submit"
        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        <PlusCircle className="w-5 h-5" />
        Add Entry
      </button>
    </form>
  );
}