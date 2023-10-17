import { CheckList } from 'antd-mobile';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { localeStateAtom } from '../../atoms';
import Screen from '../../components/Screen';

const languages = [
  {
    name: '简体中文',
    key: 'zh-CN',
  },
  {
    name: '繁體中文',
    key: 'zh-TW',
  },
  {
    name: 'ENGLISH',
    key: 'en',
  },
  {
    name: '日本語',
    key: 'ja',
  },
  {
    name: 'Русский язык',
    key: 'ru-RU',
  },
  {
    name: 'Français',
    key: 'fr',
  },
  {
    name: 'Español',
    key: 'es',
  },
  // {
  //   name: 'Português',
  //   key: 'pt',
  // },
];

const Language = () => {
  const [state, setState] = useAtom(localeStateAtom);

  const [language, setLanguage] = useState<string[]>([state.locale]);

  const history = useHistory();

  const intl = useIntl();

  return (
    <Screen
      headerTitle={intl.formatMessage({ defaultMessage: '設置語言', id: 'kIQ/Xp' })}
      footer={
        <div className="p-4 bg-[#F4F6F4]">
          <a
            className="btn-purple"
            onClick={() => {
              setState({ locale: language[0] });
              history.goBack();
            }}
          >
            {intl.formatMessage({ defaultMessage: '保存語言設置', id: 'BXndbT' })}
          </a>
        </div>
      }
    >
      <div className="flex-1 bg-[#F4F6F4]">
        <CheckList
          value={language}
          onChange={(value) => {
            if (value.length) {
              setLanguage(value as string[]);
            }
          }}
          className="bg-white mt-2"
        >
          {languages.map((v) => (
            <CheckList.Item
              key={v.key}
              value={v.key}
              className="flex-1"
              prefix={<img alt="" src={`/languages/${v.key}.png`} className="w-6 h-6" />}
            >
              {v.name}
            </CheckList.Item>
          ))}
        </CheckList>
      </div>
    </Screen>
  );
};

export default Language;
