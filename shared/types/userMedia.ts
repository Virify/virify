export type UserMediaType = 'IMAGE' | 'PDF' | 'DOCUMENT' | 'SPREADSHEET' | 'OTHER';

export interface UserMediaRecord {
  id: number;
  key: string;
  mediaType: UserMediaType;
  mimeType: string;
  originalName: string;
  size: number;
  createdAt: Date;
  url?: string;
}
