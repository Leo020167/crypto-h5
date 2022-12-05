import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { AreaListItem } from './model';
import { getAreaList } from './utils/api';

export const localeAtom = atom<string>('en');

export const areaListAtom = atom(async () => {
  const res: any = await getAreaList();
  if (res.code === '200') {
    return res.data as AreaListItem[];
  }
  return [];
});

export const countryAtom = atom<{ code: string; name: string }>({
  code: '+852',
  name: '香港',
});

export const refreshRateAtom = atomWithStorage<number>('refresh-rate', 1);
export const switchColorValueAtom = atomWithStorage<string>('switch-color-value', '1');
export const marketPeriodAtom = atomWithStorage<string>('market-period-value', 'min1');
