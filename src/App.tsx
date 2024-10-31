import React, { useState } from "react";
import { Cat, Fish, Heart, User, Brush, BookOpen } from "lucide-react";
import DiaryForm from "./components/DiaryForm";
import DiaryEntry from "./components/DiaryEntry";
import { useDiaryEntries } from "./hooks/useDiaryEntries";
import type { DiaryEntry as DiaryEntryType } from "./types";

function App() {
  const { entries, addEntry, deleteEntry, updateEntry } = useDiaryEntries();
  const [editingEntry, setEditingEntry] = useState<DiaryEntryType | null>(null);

  const handleEdit = (entry: DiaryEntryType) => {
    setEditingEntry(entry);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      {/* 头部区域 */}
      <header className="relative h-[60vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=3270"
          alt="英国短毛猫"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-4">哒哒 DaDa</h1>
            <p className="text-xl">一位珍贵的英短公主</p>
          </div>
        </div>
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
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold">哒哒的成长日记</h2>
          </div>

          <DiaryForm
            onSubmit={(entry) => {
              if (editingEntry) {
                updateEntry({ ...entry, id: editingEntry.id });
                setEditingEntry(null);
              } else {
                addEntry(entry);
              }
            }}
          />

          <div className="mt-12 space-y-8">
            {entries.map((entry) => (
              <DiaryEntry
                key={entry.id}
                entry={entry}
                onDelete={deleteEntry}
                onEdit={handleEdit}
              />
            ))}
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-white py-6 text-center text-gray-600">
        <p>用❤️为哒哒制作</p>
      </footer>
    </div>
  );
}

export default App;
