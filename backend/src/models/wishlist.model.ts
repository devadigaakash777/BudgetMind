import mongoose, { Schema, Document } from 'mongoose';

// --- ITEM INTERFACE ---
export interface IWishlistItem extends Document {
  userId: string;
  name: string;
  description: string;
  image: string;
  savedAmount: number;
  priority: number;
  cost: number;
  monthLeft: number;
  isFunded: boolean;
}

// --- SUMMARY INTERFACE ---
export interface IWishlistSummary extends Document {
  userId: string;
  totalSavedAmount: number;
}

// --- ITEM SCHEMA ---
const WishlistItemSchema = new Schema<IWishlistItem>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  image: String,
  savedAmount: { type: Number, default: 0 },
  priority: { type: Number, default: 1 },
  cost: { type: Number, required: true },
  monthLeft: { type: Number, default: 1 },
  isFunded: { type: Boolean, default: false }
});

// --- SUMMARY SCHEMA ---
const WishlistSummarySchema = new Schema<IWishlistSummary>({
  userId: { type: String, required: true, unique: true },
  totalSavedAmount: { type: Number, default: 0 }
});

// --- EXPORT MODELS ---
export const WishlistItem = mongoose.model<IWishlistItem>('WishlistItem', WishlistItemSchema);
export const WishlistSummary = mongoose.model<IWishlistSummary>('WishlistSummary', WishlistSummarySchema);
