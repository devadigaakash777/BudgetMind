'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { fetchWallet } from '@/redux/thunks/wallet-thunks';
import { fetchWishlist } from '@/redux/thunks/wishlist-thunks';
import { fetchBudgetSummary } from '@/redux/thunks/budget-thunks';
import { fetchUserProfile } from '@/redux/thunks/profile-thunks';
import { setAppLoading } from '@/redux/slices/loader-slice';

const AppInitLoader = () => {
  const dispatch = useDispatch<AppDispatch>();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  useEffect(() => {
    const loadInitialData = async () => {
      if (!accessToken) return;

      try {
        await Promise.all([
          dispatch(fetchUserProfile()).unwrap(),
          dispatch(fetchWallet()).unwrap(),
          dispatch(fetchWishlist()).unwrap(),
          dispatch(fetchBudgetSummary()).unwrap()
        ]);
        dispatch(setAppLoading(false));
      } catch (error) {
        console.error(" App init failed:", error);
        dispatch(setAppLoading(false));
      }
    };

    loadInitialData();
  }, [dispatch, accessToken]);

  return null; 
};

export default AppInitLoader;
