import create from 'zustand';
import { persist } from 'zustand/middleware';
import { getUserInfo, login, logout } from '../api/endpoints/transformer';
import { LoginBody, UserInfo } from '../api/model';

export const useAuthStore = create(
  persist<{
    token?: string;
    userInfo?: UserInfo;
    login: (data: LoginBody) => Promise<void>;
    logout: () => void;
    getUserInfo: () => Promise<void>;
  }>(
    (set, get) => ({
      async login(data) {
        const res = await login(data);
        if (res.code === '200') {
          set({ token: res.data?.token, userInfo: res.data?.user });
        }
      },
      logout() {
        logout();
        set({ token: undefined, userInfo: undefined });
      },
      async getUserInfo() {
        const { token, userInfo } = get();
        if (token && userInfo) {
          const res = await getUserInfo();
          if (res.code === '200') {
            set({ userInfo: res.data });
          }
        }
      },
    }),
    {
      name: 'auth',
    },
  ),
);
