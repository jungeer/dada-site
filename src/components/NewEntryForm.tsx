import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

interface NewEntryFormProps {
  onAdd: (entry: { date: string; content: string; image?: string }) => void;
  onClose: () => void;
}

export function NewEntryForm({ onAdd, onClose }: NewEntryFormProps) {
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
    const today = new Date().toISOString().split('T')[0];
    onAdd({ date: today, content, image });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">New Diary Entry</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-700">Upload Image</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </label>
            {image && (
              <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-4" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What did DaDa do today?"
              className="w-full p-2 border rounded-lg min-h-[150px]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Entry
          </button>
        </form>
      </div>
    </div>
  );
}