import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { AreaListItem, Register, User } from './model';
import { getAreaList } from './utils/api';

export const localeAtom = atom<string>('en');

export const areaListAtom = atom(async () => {
  const res: any = await getAreaList();
  if (res.code === '200') {
    return res.data as AreaListItem[];
  }
  return [];
});

export const registerAtom = atom<Register>({ type: 1 });

export const tokenAtom = atomWithStorage('token', '');
export const userAtom = atomWithStorage<User | null>('user', null);
export const countryAtom = atom<{ code: string; name: string }>({
  code: '+852',
  name: '香港',
});
