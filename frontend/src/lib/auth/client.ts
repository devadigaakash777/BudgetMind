'use client';

import type { User } from '@/types/user';

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    console.log(params);
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        credentials: 'include',
      });

      if (!res.ok) {
        const { message } = await res.json();
        return { error: message || 'Sign-up failed' };
      }

      return {};
    } catch {
      return { error: 'Network error during sign-up' };
    }
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ data?: User; accessToken?: string; error?: string }> {
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        credentials: 'include',
      });

      if (!res.ok) {
        const { message } = await res.json();
        return { error: message || 'Login failed' };
      }

      const { user, accessToken } = await res.json();
      return { data: user, accessToken };
    } catch {
      return { error: 'Network error during sign-in' };
    }
  }

  async getUser(accessToken: string): Promise<{ data?: User | null; error?: string }> {
    try {
      console.log("Access token sent to /me: ", accessToken);
      const res = await fetch('http://localhost:5000/api/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });

      if (!res.ok) return { data: null };
      const user = await res.json();
      return { data: user };
    } catch {
      return { error: 'Failed to fetch user' };
    }
  }

  async refresh(): Promise<{ accessToken?: string; error?: string }> {
    try {
      const res = await fetch('http://localhost:5000/api/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) return { error: 'Refresh failed' };

      const { accessToken } = await res.json();
      return { accessToken };
    } catch {
      return { error: 'Refresh network error' };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    try {
      await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      return {};
    } catch {
      return { error: 'Failed to logout' };
    }
  }

  resetPassword(value: string) {
    return value;
  }
}

export const authClient = new AuthClient();
