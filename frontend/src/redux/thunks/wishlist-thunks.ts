import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/lib/axios-instance';
import {
  setWishlistItems,
  updateFundingStatus as updateFunding,
  changePriority as reorderItem,
  increaseMonth,
  decreaseMonth,
  setWishlistSummary,
} from '../slices/wishlist-slice';
import type { WishlistItem, WishlistItemBase } from '@/types/wishlist';
import { refetchAllUserData } from '@/redux/thunks/global-refresh';
import type { AppDispatch } from '@/redux/store';
import { config } from '@/config';

interface WishlistResponse {
  items: WishlistItem[];
  totalSavedAmount: number;
}

const BASE_URL = `${config.apiBaseUrl}/wishlist`;

// Fetch all wishlist items
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { dispatch }) => {
    const res = await axios.get<WishlistResponse>(BASE_URL);
    const { items, totalSavedAmount } = res.data;

    dispatch(setWishlistItems(items));
    dispatch(setWishlistSummary({ totalSavedAmount }));
  }
);

// Add a new wishlist item
export const thunkAddWishlistItem = createAsyncThunk(
  'wishlist/addItem',
  async (item: WishlistItemBase, { dispatch }) => {
    const res = await axios.post<WishlistItem>(BASE_URL, item);
    console.debug(res);
    await refetchAllUserData(dispatch as AppDispatch);
  }
);

// Delete a wishlist item
export const thunkDeleteWishlistItem = createAsyncThunk(
  'wishlist/deleteItem',
  async (id: string, { dispatch }) => {
    await axios.delete(`${BASE_URL}/${id}`);
    await refetchAllUserData(dispatch as AppDispatch);
  }
);

// Toggle funded status
export const thunkUpdateFundingStatus = createAsyncThunk(
  'wishlist/updateFundingStatus',
  async (data: { id: string; isFunded: boolean }, { dispatch }) => {
    await axios.patch(`${BASE_URL}/${data.id}/fund`, { isFunded: data.isFunded });
    dispatch(updateFunding(data));
  }
);

// Change priority of an item
export const thunkChangePriority = createAsyncThunk(
  'wishlist/changePriority',
  async (data: { id: string; newPriority: number }, { dispatch }) => {
    await axios.patch(`${BASE_URL}/${data.id}/priority`, { newPriority: data.newPriority });
    dispatch(reorderItem(data));
  }
);

// Increase monthLeft
export const thunkIncreaseMonth = createAsyncThunk(
  'wishlist/increaseMonth',
  async (id: string, { dispatch }) => {
    await axios.patch(`${BASE_URL}/${id}/month`, { direction: 'increase' });
    dispatch(increaseMonth(id));
  }
);

// Decrease monthLeft
export const thunkDecreaseMonth = createAsyncThunk(
  'wishlist/decreaseMonth',
  async (id: string, { dispatch }) => {
    await axios.patch(`${BASE_URL}/${id}/month`, { direction: 'decrease' });
    dispatch(decreaseMonth(id));
  }
);

// Buy item if funded
export const thunkBuyItem = createAsyncThunk(
  'wishlist/buyItem',
  async (data: { id: string; preference: 'main' | 'wishlist'; reduceDailyBudget: boolean }, { dispatch }) => {
    await axios.post(`${BASE_URL}/${data.id}/buy`, {preference: data.preference, reduceDailyBudget: data.reduceDailyBudget});
    await refetchAllUserData(dispatch as AppDispatch);
  }
);

// Bulk reorder priorities
export const thunkBulkReorder = createAsyncThunk(
  'wishlist/bulkReorder',
  async (updates: { id: string; priority: number }[]) => {
    await axios.patch(`${BASE_URL}/reorder`, { updates });
  }
);
