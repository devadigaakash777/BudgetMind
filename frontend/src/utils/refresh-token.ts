import axios from 'axios';
import store from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser, setAccessToken } from '@/redux/slices/user-slice';
import { RootState } from '@/redux/store';
import {isTokenExpired} from '@/utils/jwt-decoder';
import type { User } from '@/types/user';
import { authClient } from '@/lib/auth/client';

export async function refreshTokenIfNeeded(): Promise<string | null> {
  let token = store.getState().user.accessToken;

  if (!token || isTokenExpired(token)) {
    try {
      const refreshResponse = await authClient.refresh();

      if (refreshResponse.accessToken) {
        token = refreshResponse.accessToken;
        store.dispatch(setAccessToken(refreshResponse.accessToken));
        return token;
      } else {
        store.dispatch(clearUser());
        return null;
      }
    } catch (err) {
      store.dispatch(clearUser());
      return null;
    }
  }

  return token;
}
