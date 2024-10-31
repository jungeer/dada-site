import React, { useState, useRef } from "react";
import { BookOpen, LogIn, LogOut, Image as ImageIcon } from "lucide-react";
import DiaryForm from "./components/DiaryForm";
import DiaryEntry from "./components/DiaryEntry";
import { useDiaryEntries } from "./hooks/useDiaryEntries";
import { useBackgroundImage } from "./hooks/useBackgroundImage";
import { useAuth } from "./hooks/useAuth";
import type { DiaryEntry as DiaryEntryType } from "./types";
import Toast from "./components/Toast";
import LoginModal from "./components/LoginModal";

function App() {
  const { entries, isLoading, addEntry, deleteEntry, updateEntry } =
    useDiaryEntries();
  const { backgroundImage, updateBackgroundImage } = useBackgroundImage();
  const { user, isAdmin, signOut } = useAuth();
  const [editingEntry, setEditingEntry] = useState<DiaryEntryType | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (entry: DiaryEntryType) => {
    setEditingEntry(entry);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        updateBackgroundImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      {/* 头部区域 */}
      <header className="relative h-[60vh] overflow-hidden">
        <img
          src={backgroundImage}
          alt="英国蓝短猫"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-4">哒哒 DaDa</h1>
            <p className="text-xl">一位珍贵的英短公主</p>
          </div>
        </div>

        {/* 登录按钮 */}
        <div className="absolute top-4 right-4 flex items-center gap-4">
          {user ? (
            <>
              <span className="text-white">
                {isAdmin ? "管理员" : "访客"}：{user.email}
              </span>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white/90 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>退出登录</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white/90 rounded-lg transition-colors"
            >
              <LogIn className="w-5 h-5" />
              <span>登录</span>
            </button>
          )}
        </div>

        {/* 背景图片修改按钮（仅管理员可见） */}
        {isAdmin && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white/90 rounded-lg transition-colors"
          >
            <ImageIcon className="w-5 h-5" />
            <span>更换背景图片</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleBackgroundChange}
          className="hidden"
        />
      </header>

      {/* 日记区域 */}
      <section className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold">哒哒的成长日记</h2>
        </div>

        {/* 日记表单（仅管理员可见） */}
        {isAdmin && (
          <DiaryForm
            onSubmit={async (entry) => {
              if (editingEntry) {
                const result = await updateEntry({
                  ...entry,
                  id: editingEntry.id,
                  created_at: editingEntry.created_at,
                });
                if (result.success) {
                  setToast({ message: "日记更新成功！", type: "success" });
                  setEditingEntry(null);
                } else {
                  setToast({ message: "日记更新失败", type: "error" });
                }
              } else {
                const result = await addEntry(entry);
                if (result.success) {
                  setToast({ message: "日记添加成功！", type: "success" });
                } else {
                  setToast({ message: "日记添加失败", type: "error" });
                }
              }
            }}
          />
        )}

        {/* 日记列表 */}
        <div className="mt-12 space-y-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">加载中...</p>
            </div>
          ) : entries.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              还没有日记，快来写第一篇吧！
            </p>
          ) : (
            entries.map((entry) => (
              <DiaryEntry
                key={entry.id}
                entry={entry}
                onDelete={
                  isAdmin
                    ? async (id) => {
                        const result = await deleteEntry(id);
                        if (result.success) {
                          setToast({
                            message: "日记删除成功！",
                            type: "success",
                          });
                        } else {
                          setToast({ message: "日记删除失败", type: "error" });
                        }
                      }
                    : undefined
                }
                onEdit={isAdmin ? handleEdit : undefined}
              />
            ))
          )}
        </div>
      </section>

      {/* 登录弹窗 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setToast({ message: "登录成功！", type: "success" })}
      />

      {/* Toast 提示 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
