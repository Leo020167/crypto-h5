import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd-mobile';
import enUS from 'antd-mobile/es/locales/en-US';
import esES from 'antd-mobile/es/locales/es-ES';
import frFR from 'antd-mobile/es/locales/fr-FR';
import jaJP from 'antd-mobile/es/locales/ja-JP';
import koKR from 'antd-mobile/es/locales/ko-KR';
import ruRU from 'antd-mobile/es/locales/ru-RU';
import zhCN from 'antd-mobile/es/locales/zh-CN';
import zhTW from 'antd-mobile/es/locales/zh-TW';
import th from './lang/antd-th';
import vi from './lang/antd-vi';

import { useAtomValue } from 'jotai';
import { parse, stringify } from 'query-string';
import { useEffect, useRef, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { HashRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import GlobalStyle from './GlobalStyle';
import { localeStateAtom } from './atoms';

import Routes from './routes';
import { useAuthStore } from './stores/auth';

const localeMap: { [key: string]: any } = {
  en: enUS,
  es: esES,
  fr: frFR,
  ja: jaJP,
  ko: koKR,
  ru: ruRU,
  va: vi,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  th: th,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const options = {
  searchStringToObject: parse,
  objectToSearchString: stringify,
};

interface StructuredMessage {
  string: string;
}

type LocaleMessages = Record<string, StructuredMessage>;

function getKeyValueJson(messages: LocaleMessages): Record<string, string> | undefined {
  if (messages) {
    const keyValueMessages: Record<string, string> = {};
    return Object.entries(messages).reduce((acc, [id, msg]) => {
      acc[id] = msg.string;
      return acc;
    }, keyValueMessages);
  }
}
//

function App() {
  const localeState = useAtomValue(localeStateAtom);

  const [messages, setMessages] = useState<LocaleMessages>({});

  useEffect(() => {
    (async () => {
      const mod = await import(`./lang/${localeState.locale}.json`);
      setMessages(mod.default);
    })();
  }, [localeState.locale]);

  const mounted = useRef<boolean>(false);

  const authStore = useAuthStore();
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    authStore.getUserInfo();
  }, [authStore]);

  return (
    <QueryClientProvider client={queryClient}>
      <IntlProvider
        locale={localeState.locale}
        defaultLocale="en"
        key={localeState.locale}
        messages={getKeyValueJson(messages)}
      >
        <ConfigProvider locale={localeMap[localeState.locale] ?? enUS}>
          <HashRouter>
            <QueryParamProvider adapter={ReactRouter5Adapter} options={options}>
              <Routes />
            </QueryParamProvider>
          </HashRouter>
          <GlobalStyle />
        </ConfigProvider>
      </IntlProvider>
    </QueryClientProvider>
  );
}

export default App;
