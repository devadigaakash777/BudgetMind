import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { WishlistItem } from '@/types/wishlist';

const initialState = {
  items: [
    {
      _id: 'unknown',
      name: 'Item Name',
      description: 'Description about item',
      image: '',
      savedAmount: 0,
      priority: 0,
      cost: 0,
      monthLeft: 0,
      isFunded: false
    },
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
    setWishlistSummary(
      state,
      action: PayloadAction<{ totalSavedAmount: number }>
    ) {
      state.totalSavedAmount = action.payload.totalSavedAmount;
    },
    addWishlistItem(state, action: PayloadAction<WishlistItem>) {
      state.items.push(action.payload);
    },
    deleteWishlistItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
    increaseMonth(state, action: PayloadAction<string>) {
      const item = state.items.find(item => item._id === action.payload);
      if (item) item.monthLeft += 1;
    },
    decreaseMonth(state, action: PayloadAction<string>) {
      const item = state.items.find(item => item._id === action.payload);
      if (item && item.monthLeft > 1) item.monthLeft -= 1;
    },
    changePriority(
      state,
      action: PayloadAction<{ id: string; newPriority: number }>
    ) {
      const { id, newPriority } = action.payload;
      const item = state.items.find(item => item._id === id);
      if (item) {
        for (const other of state.items) {
          if (other._id !== id && other.priority === newPriority) {
            other.priority += 1;
          }
        }
        item.priority = newPriority;
      }
    },
    buyItem(state, action: PayloadAction<string>) {
      const item = state.items.find(item => item._id === action.payload);
      if (item?.isFunded) {
        state.items = state.items.filter(i => i._id !== item._id);
      }
    },
    updateFundingStatus(
      state,
      action: PayloadAction<{ id: string; isFunded: boolean }>
    ) {
      const item = state.items.find(item => item._id === action.payload.id);
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
  setRowsPerPage,
  setWishlistSummary,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
