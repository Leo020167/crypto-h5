import { useAtom, useAtomValue } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { useEffect } from 'react';
import { areaListAtom } from '../atoms';
import { Country } from '../model';
import { useAuthStore } from '../stores/auth';

const countryAtom = atomWithStorage<Country>(
  'register-country',
  {
    code: '+1',
    name: 'United States of America',
  },
  createJSONStorage(() => sessionStorage),
);

const useCountry = (): [Country, React.Dispatch<React.SetStateAction<Country>>] => {
  const { userInfo } = useAuthStore();
  const areaList = useAtomValue(areaListAtom);

  const [country, setCountry] = useAtom(countryAtom);

  useEffect(() => {
    if (userInfo?.countryCode) {
      const c = areaList.find((v) => v.areaCode === userInfo?.countryCode);
      if (c) {
        setCountry({ code: c.areaCode, name: c.tcName });
      }
    }
  }, [areaList, setCountry, userInfo?.countryCode]);

  return [country, setCountry];
};

export default useCountry;
