import React, { useState } from 'react';
import { Cat, Fish, Heart, User, Brush, BookOpen } from 'lucide-react';
import DiaryForm from './components/DiaryForm';
import DiaryEntry from './components/DiaryEntry';
import { useDiaryEntries } from './hooks/useDiaryEntries';
import type { DiaryEntry as DiaryEntryType } from './types';

function App() {
  const { entries, addEntry, deleteEntry, updateEntry } = useDiaryEntries();
  const [editingEntry, setEditingEntry] = useState<DiaryEntryType | null>(null);

  const handleEdit = (entry: DiaryEntryType) => {
    setEditingEntry(entry);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      {/* Hero Section */}
      <header className="relative h-[60vh] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=3270"
          alt="British Shorthair Cat"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-4">哒哒 DaDa</h1>
            <p className="text-xl">A Precious British Shorthair Princess</p>
          </div>
        </div>
      </header>

      {/* About Section */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <Cat className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold">About Me</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                I'm a beautiful 5-year-old British Shorthair with a stunning blue coat. 
                My ears might be short, but they're perfectly suited to my adorable face!
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <Fish className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold">Food Preferences</h2>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Favorite food: Taii Sauerkraut Fish Cat Food</li>
                <li>• Not a fan of egg yolks</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold">Personality</h2>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• A bit shy and timid</li>
                <li>• Very affectionate with my favorite human</li>
                <li>• Gentle and sweet-natured</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold">Special Bond</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                My favorite human is Hui Hui. We share a special connection that makes my heart purr with joy!
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <Brush className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold">Grooming Notes</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                I'm known for my luxurious but high-maintenance coat. 
                Yes, I shed quite a bit, but that's just me sharing my love everywhere I go!
              </p>
            </div>
          </div>
        </div>

        {/* Diary Section */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold">DaDa's Growth Diary</h2>
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

      {/* Footer */}
      <footer className="bg-white py-6 text-center text-gray-600">
        <p>Made with ❤️ for 哒哒 DaDa</p>
      </footer>
    </div>
  );
}

export default App;