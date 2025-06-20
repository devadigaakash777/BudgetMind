import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    {
      id: 'A',
      name: 'Drone',
      description: 'A high-end drone for photography',
      image: '/assets/product-1.png',
      savedAmount: 5000,
      priority: 3,
      cost: 10000,
      monthLeft: 5,
      isFunded: false
    },
    {
      id: 'B',
      name: 'Watch',
      description: 'Luxury wristwatch',
      image: '/assets/product-2.png',
      savedAmount: 1500,
      priority: 1,
      cost: 3000,
      monthLeft: 3,
      isFunded: false
    }
  ]
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlistItems(state, action) {
      state.items = action.payload;
    },
    addWishlistItem(state, action) {
      state.items.push(action.payload);
    },
    deleteWishlistItem(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    increaseMonth(state, action) {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.monthLeft += 1;
      }
    },
    decreaseMonth(state, action) {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.monthLeft > 1) {
        item.monthLeft -= 1;
      }
    },
    changePriority(state, action) {
      const { id, newPriority } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        // avoid two having same priority — shift other items
        state.items.forEach(other => {
          if (other.id !== id && other.priority === newPriority) {
            other.priority += 1; // simple shift up
          }
        });
        item.priority = newPriority;
      }
    },
    buyItem(state, action) {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.isFunded) {
        state.items = state.items.filter(i => i.id !== item.id);
      }
    },
    updateFundingStatus(state, action) {
      const { id, isFunded } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.isFunded = isFunded;
      }
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
  updateFundingStatus
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
