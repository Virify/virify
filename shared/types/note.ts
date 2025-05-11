/**
 * Type definitions for user notes
 */

export type NoteData = {
  propertyId: number;
  note: string;
};

export type NoteUpdateRespons = {
  propertyId: number;
  hasNote: boolean;
};

export type NoteResponse = string | null;
