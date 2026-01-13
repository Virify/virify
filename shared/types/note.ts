/**
 * Type definitions for user notes
 */
import type { ListingCardType } from "./listing";

export type NoteData = {
  id: number;
  userPreferencesId: number;
  listing: ListingCardType | null;
  listingId: number;
  note: string;
  createdAt: Date | string;
  updatedAt: Date;
}

export type NoteUpdateResponse = {
  id: number;
  hasNote: boolean;
};

export type NoteResponse = string | null;

export type NoteLookup = {
  listingId: number;
  note: string;
}