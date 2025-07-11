'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { refetchAllUserData } from '@/redux/thunks/global-refresh';

const AppInitLoader = () => {
  const dispatch = useDispatch<AppDispatch>();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  useEffect(() => {
    if (accessToken) {
      refetchAllUserData(dispatch);
    }
  }, [dispatch, accessToken]);

  return null;
};

export default AppInitLoader;
