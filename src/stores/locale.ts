import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useLocaleStore = create(
  persist<{ locale: string }>(() => ({ locale: 'en' }), { name: 'locale' }),
);
