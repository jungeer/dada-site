export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  image?: string;
  created_at: string;
}

export interface NewDiaryEntry {
  title: string;
  content: string;
  image?: string;
}

export interface ImageUploadResult {
  dataUrl: string;
}
