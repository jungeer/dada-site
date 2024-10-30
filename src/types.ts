export interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  image?: string;
}

export interface ImageUploadResult {
  dataUrl: string;
}