import React, { useState, useEffect } from "react";
import { X, Image as ImageIcon, Save } from "lucide-react";
import type { DiaryEntry, NewDiaryEntry } from "../types";

interface DiaryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: NewDiaryEntry) => void;
  editingEntry?: DiaryEntry;
  isLoading?: boolean;
}

export default function DiaryFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingEntry,
  isLoading = false,
}: DiaryFormModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string>();
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  useEffect(() => {
    if (editingEntry) {
      setTitle(editingEntry.title);
      setContent(editingEntry.content);
      setImage(editingEntry.image);
    } else {
      setTitle("");
      setContent("");
      setImage(undefined);
    }
  }, [editingEntry]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    await onSubmit({
      title: title.trim(),
      content: content.trim(),
      image,
    });

    setTitle("");
    setContent("");
    setImage(undefined);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {editingEntry ? "编辑日记" : "新建日记"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                标题
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="日记标题"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                内容
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="今天哒哒做了什么呢？"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                图片
              </label>
              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition w-fit">
                  <ImageIcon className="w-5 h-5" />
                  <span>选择图片</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {image && (
                  <div className="relative">
                    <img
                      src={image}
                      alt="预览"
                      className="w-full h-48 object-cover rounded-lg cursor-pointer"
                      onClick={() => setIsPreviewVisible(true)}
                    />
                    <button
                      type="button"
                      onClick={() => setImage(undefined)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <Save className="w-5 h-5" />
                {editingEntry ? "更新" : "添加"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 图片预览模态框 */}
      {isPreviewVisible && image && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setIsPreviewVisible(false)}
        >
          <img
            src={image}
            alt="大图预览"
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
          <button
            onClick={() => setIsPreviewVisible(false)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
