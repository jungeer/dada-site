import React, { useState, useRef } from "react";
import {
  Cat,
  Fish,
  Heart,
  User,
  Brush,
  BookOpen,
  LogIn,
  LogOut,
  Image as ImageIcon,
  PlusCircle,
} from "lucide-react";
import DiaryEntry from "./components/DiaryEntry";
import Toast from "./components/Toast";
import LoginModal from "./components/LoginModal";
import DiaryFormModal from "./components/DiaryFormModal";
import ConfirmModal from "./components/ConfirmModal";
import { useDiaryEntries } from "./hooks/useDiaryEntries";
import { useBackgroundImage } from "./hooks/useBackgroundImage";
import { useAuth } from "./hooks/useAuth";
import type { DiaryEntry as DiaryEntryType } from "./types";

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
  const [isDiaryFormOpen, setIsDiaryFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteClick = (id: string) => {
    setDeletingEntryId(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEntryId) return;

    setIsSubmitting(true);
    const result = await deleteEntry(deletingEntryId);
    setIsSubmitting(false);

    if (result.success) {
      setToast({ message: "日记删除成功！", type: "success" });
      setIsConfirmDeleteOpen(false);
      setDeletingEntryId(null);
    } else {
      setToast({ message: "日记删除失败", type: "error" });
    }
  };

  const handleSubmit = async (
    entry: Omit<DiaryEntryType, "id" | "created_at">
  ) => {
    setIsSubmitting(true);

    try {
      if (editingEntry) {
        const result = await updateEntry({
          ...entry,
          id: editingEntry.id,
          created_at: editingEntry.created_at,
        });

        if (result.success) {
          setToast({ message: "日记更新成功！", type: "success" });
          setIsDiaryFormOpen(false);
          setEditingEntry(null);
        } else {
          setToast({ message: "日记更新失败，请重试", type: "error" });
        }
      } else {
        const result = await addEntry(entry);

        if (result.success) {
          setToast({ message: "日记添加成功！", type: "success" });
          setIsDiaryFormOpen(false);
        } else {
          setToast({ message: "日记添加失败，请重试", type: "error" });
        }
      }
    } catch {
      setToast({ message: "操作失败，请重试", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        const updateResult = await updateBackgroundImage(result);
        if (updateResult.success) {
          setToast({ message: "背景图片更新成功！", type: "success" });
        } else {
          setToast({ message: "背景图片更新失败，请重试", type: "error" });
        }
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

      {/* 关于区域 */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <Cat className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold">关于我</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                我是一只漂亮的5岁英国短毛猫，有着迷人的蓝色毛发。
                虽然我的耳朵有点短，但它们完美地搭配我可爱的脸庞！
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <Fish className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold">饮食偏好</h2>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• 最爱的食物：太一酸菜鱼猫粮</li>
                <li>• 不喜欢蛋黄</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold">性格特点</h2>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• 有点害羞和胆小</li>
                <li>• 对最喜欢的人非常亲昵</li>
                <li>• 温柔可爱的性格</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold">特殊羁绊</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                我最喜欢的人是慧慧。我们之间有着特殊的联系，让我的心充满喜悦！
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <Brush className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold">护理笔记</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                我以华丽但需要精心护理的毛发而闻名。
                是的，我掉毛比较多，但这只是我在到处分享我的爱！
              </p>
            </div>
          </div>
        </div>

        {/* 日记区域 */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold">哒哒的成长日记</h2>
            </div>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingEntry(null);
                  setIsDiaryFormOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <PlusCircle className="w-5 h-5" />
                <span>写日记</span>
              </button>
            )}
          </div>

          {/* 日记列表 */}
          <div className="mt-8 space-y-8">
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
                  onDelete={isAdmin ? handleDeleteClick : undefined}
                  onEdit={
                    isAdmin
                      ? (entry) => {
                          setEditingEntry(entry);
                          setIsDiaryFormOpen(true);
                        }
                      : undefined
                  }
                />
              ))
            )}
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-white py-6 text-center text-gray-600">
        <p>用❤️为哒哒制作</p>
      </footer>

      {/* 日记表单弹窗 */}
      <DiaryFormModal
        isOpen={isDiaryFormOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsDiaryFormOpen(false);
            setEditingEntry(null);
          }
        }}
        editingEntry={editingEntry || undefined}
        isLoading={isSubmitting}
        onSubmit={handleSubmit}
      />

      {/* 删除确认弹窗 */}
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsConfirmDeleteOpen(false);
            setDeletingEntryId(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
        title="确认删除"
        message="确定要删除这篇日记吗？此操作无法撤销。"
        confirmText="删除"
        isLoading={isSubmitting}
      />

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
