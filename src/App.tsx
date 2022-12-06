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
import { localeStateAtom } from './atoms';
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
  const localeState = useAtomValue(localeStateAtom);

  const [messages, setMessages] = useState<Record<string, string>>();

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
        messages={messages}
      >
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
