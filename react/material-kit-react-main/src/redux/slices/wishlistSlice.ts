import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    { id: 'A', name: "Drone",image: '/assets/product-1.png', savedAmount: 5000, priority: 3, cost: 10000, monthsToBuy: 5, isFunded: false },
    { id: 'B', name: "Watch",image: '/assets/product-2.png', savedAmount: 1500, priority: 1, cost: 3000, monthsToBuy: 3, isFunded: false}
  ],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlistItems(state, action) {
      state.items = action.payload;
    }
  },
});

export const { setWishlistItems } = wishlistSlice.actions;
export default wishlistSlice.reducer;