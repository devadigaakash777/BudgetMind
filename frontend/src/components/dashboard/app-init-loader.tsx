'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { fetchWallet } from '@/redux/thunks/wallet-thunks';
import { fetchWishlist } from '@/redux/thunks/wishlist-thunks';
import { fetchBudgetSummary } from '@/redux/thunks/budget-thunks';

const AppInitLoader = () => {
  const dispatch = useDispatch<AppDispatch>();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchWallet());
      dispatch(fetchWishlist());
      dispatch(fetchBudgetSummary());
    }
  }, [dispatch, accessToken]); // ✅ only trigger when accessToken is ready

  return null;
};

export default AppInitLoader;
