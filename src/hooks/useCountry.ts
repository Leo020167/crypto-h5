import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { areaListAtom } from '../atoms';
import { Country } from '../model';
import { useAuthStore } from '../stores/auth';

const useCountry = (): [Country, React.Dispatch<React.SetStateAction<Country>>] => {
  const { userInfo } = useAuthStore();
  const areaList = useAtomValue(areaListAtom);

  const [country, setCountry] = useState<Country>({ code: '+86', name: '中國大陸' });

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
