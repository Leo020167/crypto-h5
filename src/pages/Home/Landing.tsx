import { useAtom } from 'jotai';
import { useLayoutEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTimeoutFn } from 'react-use';
import { landingAtom } from '../../atoms';

import logo from '../../assets/landing.png';

export const Landing = () => {
  const [landing, setLanding] = useAtom(landingAtom);
  const history = useHistory();

  useTimeoutFn(() => {
    setLanding(true);
    history.replace('/home');
  }, 3 * 1000);

  useLayoutEffect(() => {
    if (landing) {
      history.replace('/home');
    }
  }, [history, landing]);

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-10 flex h-screen items-center justify-center bg-[#161720]">
      <img src={logo} alt="" className="h-auto w-full" />
    </div>
  );
};
