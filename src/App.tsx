import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { parse, stringify } from 'query-string';
import { useEffect, useRef, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { HashRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import GlobalStyle from './GlobalStyle';
import Routes from './Routes';
import { localeAtom } from './atoms';
import { useAuthStore } from './stores/auth';

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

function App() {
  const locale = useAtomValue(localeAtom);

  const [messages, setMessages] = useState<Record<string, string>>();

  useEffect(() => {
    (async () => {
      const mod = await import(`./lang/${locale}.json`);
      setMessages(mod.default);
    })();
  }, [locale]);

  const mounted = useRef<boolean>(false);

  const authStore = useAuthStore();
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    authStore.getUserInfo();
  }, [authStore]);

  return (
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale={locale} defaultLocale="en" key={locale} messages={messages}>
        <HashRouter>
          <QueryParamProvider adapter={ReactRouter5Adapter} options={options}>
            <Routes />
          </QueryParamProvider>
        </HashRouter>
        <GlobalStyle />
      </IntlProvider>
    </QueryClientProvider>
  );
}

export default App;
