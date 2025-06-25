import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user-slice';
import walletReducer from './slices/wallet-slice';
import budgetReducer from './slices/budget-slice';
import wishlistReducer from './slices/wishlist-slice';
import previewReducer from './slices/preview-slice';
import expenseReducer from './slices/daily-expenses-slice';


const store = configureStore({
  reducer: {
    user: userReducer,
    wallet: walletReducer,
    budget: budgetReducer ,
    wishlist: wishlistReducer,
    expense: expenseReducer,
    preview: previewReducer
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;