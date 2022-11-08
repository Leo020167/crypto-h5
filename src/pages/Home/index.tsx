import { useSetAtom } from 'jotai';
import { FormattedMessage } from 'react-intl';
import { localeAtom } from '../../atoms';

const Home = () => {
  const setLocale = useSetAtom(localeAtom);
  return (
    <div>
      <a
        onClick={() => {
          setLocale('en');
        }}
      >
        en
      </a>

      <a
        onClick={() => {
          setLocale('zh-Hans');
        }}
      >
        zh-Hans
      </a>
      <a
        onClick={() => {
          setLocale('zh-Hant');
        }}
      >
        zh-Hant
      </a>
      <div>
        <FormattedMessage id="locale" />
      </div>
    </div>
  );
};

export default Home;
