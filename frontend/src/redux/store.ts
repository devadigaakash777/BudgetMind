import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import walletReducer from './slices/walletSlice';
import budgetReducer from './slices/budgetSlice';
import wishlistReducer from './slices/wishlistSlice';
import previewReducer from './slices/previewSlice';
import expenseReducer from './slices/dailyExpensesSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    wallet: walletReducer,
    budget: budgetReducer,
    wishlist: wishlistReducer,
    expense: expenseReducer,
    preview: previewReducer
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;