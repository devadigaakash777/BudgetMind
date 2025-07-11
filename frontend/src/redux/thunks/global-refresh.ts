import { AppDispatch } from '@/redux/store';
import { fetchUserProfile } from '@/redux/thunks/profile-thunks';
import { fetchWallet } from '@/redux/thunks/wallet-thunks';
import { fetchWishlist } from '@/redux/thunks/wishlist-thunks';
import { fetchBudgetSummary } from '@/redux/thunks/budget-thunks';
import { thunkFetchDailyExpenses } from '@/redux/thunks/expense-thunks';
import { setAppLoading } from '@/redux/slices/loader-slice';

export const refetchAllUserData = async (dispatch: AppDispatch) => {
  try {
    await Promise.all([
      dispatch(fetchUserProfile()).unwrap(),
      dispatch(fetchWallet()).unwrap(),
      dispatch(fetchWishlist()).unwrap(),
      dispatch(fetchBudgetSummary()).unwrap(),
      dispatch(thunkFetchDailyExpenses()).unwrap()
    ]);
    dispatch(setAppLoading(false));
  } catch (error) {
    console.error("Refetch failed:", error);
    dispatch(setAppLoading(false));
  }
};
