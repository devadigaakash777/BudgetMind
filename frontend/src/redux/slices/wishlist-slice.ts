import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { WishlistItem } from '@/types/wishlist';

const initialState = {
  items: [
    {
      id: 'A',
      name: 'Drone',
      description: 'A high-end drone for photography',
      image: '/assets/product-1.png',
      savedAmount: 5000,
      priority: 1,
      cost: 10_000,
      monthLeft: 5,
      isFunded: false
    },
    {
      id: 'B',
      name: 'Watch',
      description: 'Luxury wristwatch',
      image: '/assets/product-2.png',
      savedAmount: 1500,
      priority: 2,
      cost: 3000,
      monthLeft: 3,
      isFunded: false
    },
    {
      id: 'C',
      name: 'Drone',
      description: 'A high-end drone for photography',
      image: '/assets/product-1.png',
      savedAmount: 5000,
      priority: 3,
      cost: 10_000,
      monthLeft: 5,
      isFunded: false
    },
    {
      id: 'D',
      name: 'Watch',
      description: 'Luxury wristwatch',
      image: '/assets/product-2.png',
      savedAmount: 1500,
      priority: 4,
      cost: 3000,
      monthLeft: 3,
      isFunded: false
    },
    {
      id: 'E',
      name: 'Drone',
      description: 'A high-end drone for photography',
      image: '/assets/product-1.png',
      savedAmount: 5000,
      priority: 5,
      cost: 10_000,
      monthLeft: 5,
      isFunded: true
    },
    {
      id: 'F',
      name: 'Watch',
      description: 'Luxury wristwatch',
      image: '/assets/product-2.png',
      savedAmount: 1500,
      priority: 6,
      cost: 3000,
      monthLeft: 3,
      isFunded: false
    }
  ],
  totalSavedAmount: 19_500,
  page: 0,
  rowsPerPage: 3
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlistItems(state, action: PayloadAction<WishlistItem[]>) {
      state.items = action.payload;
    },
    addWishlistItem(state, action: PayloadAction<WishlistItem>) {
      state.items.push(action.payload);
    },
    deleteWishlistItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    increaseMonth(state, action: PayloadAction<string>) {
      const item = state.items.find(item => item.id === action.payload);
      if (item) item.monthLeft += 1;
    },
    decreaseMonth(state, action: PayloadAction<string>) {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.monthLeft > 1) item.monthLeft -= 1;
    },
    changePriority(
      state,
      action: PayloadAction<{ id: string; newPriority: number }>
    ) {
      const { id, newPriority } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        for (const other of state.items) {
          if (other.id !== id && other.priority === newPriority) {
            other.priority += 1;
          }
        }
        item.priority = newPriority;
      }
    },
    buyItem(state, action: PayloadAction<string>) {
      const item = state.items.find(item => item.id === action.payload);
      if (item?.isFunded) {
        state.items = state.items.filter(i => i.id !== item.id);
      }
    },
    updateFundingStatus(
      state,
      action: PayloadAction<{ id: string; isFunded: boolean }>
    ) {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) item.isFunded = action.payload.isFunded;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setRowsPerPage(state, action: PayloadAction<number>) {
      state.rowsPerPage = action.payload;
    }
  }
});

export const {
  setWishlistItems,
  addWishlistItem,
  deleteWishlistItem,
  increaseMonth,
  decreaseMonth,
  changePriority,
  buyItem,
  updateFundingStatus,
  setPage,
  setRowsPerPage
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
