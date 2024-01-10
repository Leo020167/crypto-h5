import { atom } from 'jotai';
import { atomWithStore } from 'jotai-zustand';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { AreaListItem } from './model';
import { useLocaleStore } from './stores/locale';
import { getAreaList } from './utils/api';

export const localeStateAtom = atomWithStore(useLocaleStore);

export const areaListAtom = atom(async () => {
  const res: any = await getAreaList();
  if (res.code === '200') {
    return res.data as AreaListItem[];
  }
  return [];
});

export const refreshRateAtom = atomWithStorage<number>('refresh-rate', 2);
export const switchColorValueAtom = atomWithStorage<string>('switch-color-value', '1');
export const marketPeriodAtom = atomWithStorage<string>('market-period-value', 'min1');
export const reportAtom = atomWithStorage<string>('report', '');

export const usernamePasswordAtom = atomWithStorage<
  { username: string; password: string } | undefined
>('username-password', undefined);

export const darkModeAtom = atomWithStorage<'dark' | 'light'>('dark-mode', 'light');
export const landingAtom = atomWithStorage<boolean>(
  'landing',
  false,
  createJSONStorage(() => sessionStorage),
);
