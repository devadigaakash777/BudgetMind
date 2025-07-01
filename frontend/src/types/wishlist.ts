export interface WishlistItem {
  _id: string;
  name: string;
  description: string;
  image: string;
  savedAmount: number;
  priority: number;
  cost: number;
  monthLeft: number;
  isFunded: boolean;
}

export interface WishlistState {
  items: WishlistItem[];
  totalSavedAmount: number;
  page: number;
  rowsPerPage: number;
}

export interface WishlistItemBase {
  name: string;
  description: string;
  image: string;
  savedAmount: number;
  priority: number;
  cost: number;
  monthLeft: number;
  isFunded: boolean;
}