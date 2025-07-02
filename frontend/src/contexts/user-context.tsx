'use client';

import * as React from 'react';
import type { User } from '@/types/user';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser, setAccessToken } from '@/redux/slices/user-slice';
import { RootState } from '@/redux/store';
import { refreshTokenIfNeeded } from '@/utils/refresh-token';

export interface UserContextValue {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  checkSession?: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<{ error: string | null; isLoading: boolean }>({
    error: null,
    isLoading: true,
  });

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.data);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  const checkSession = React.useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      let token = accessToken;

      if (!token) {
        const refreshResponse = await authClient.refresh();
        if (refreshResponse.accessToken) {
          token = refreshResponse.accessToken;
          dispatch(setAccessToken(refreshResponse.accessToken));
        } else {
          dispatch(clearUser());
          return;
        }
      }

      if (!token) {
        dispatch(clearUser());
        return;
      }

      const { data, error } = await authClient.getUser(token);

      if (error || !data) {
        dispatch(clearUser());
        return;
      }

      dispatch(setUser(data));
    } catch (err) {
      logger.error('checkSession error', err);
      dispatch(clearUser());
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [accessToken, dispatch]);

  // Only call checkSession once on first mount
  React.useEffect(() => {
    if (!user) {
      checkSession().catch((error) => {
        logger.error(error);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ Only run once on initial load


  React.useEffect(() => {
    const refreshIfVisible = () => {
      if (document.visibilityState === 'visible') {
        refreshTokenIfNeeded()
          .then(() => console.warn("refreshed inside"))
          .catch((err) => console.error("refresh failed", err));
      }
    };

    const interval = setInterval(refreshIfVisible, 7 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);



  return (
    <UserContext.Provider
      value={{
        user,
        error: state.error,
        isLoading: state.isLoading,
        checkSession,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const UserConsumer = UserContext.Consumer;
