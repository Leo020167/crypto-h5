import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAtom, useAtomValue } from 'jotai';
import { parse, stringify } from 'query-string';
import { useEffect, useRef, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import GlobalStyle from './GlobalStyle';
import { localeAtom, tokenAtom, userAtom } from './atoms';
import routes from './routes';
import { getUserInfo } from './utils/api';

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

  const [token] = useAtom(tokenAtom);
  const [, setUser] = useAtom(userAtom);
  const [messages, setMessages] = useState<Record<string, string>>();

  useEffect(() => {
    (async () => {
      const mod = await import(`./locale/${locale}.json`);
      setMessages(mod.default);
    })();
  }, [locale]);

  const mounted = useRef<boolean>(false);

  useEffect(() => {
    if (token) {
      if (mounted.current) return;
      mounted.current = true;
      getUserInfo().then((res: any) => {
        if (res.code === '200') {
          setUser(res.data);
        }
      });
    }
  }, [setUser, token]);

  return (
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale={locale} defaultLocale="en" key={locale} messages={messages}>
        <BrowserRouter>
          <QueryParamProvider adapter={ReactRouter6Adapter} options={options}>
            <Routes />
          </QueryParamProvider>
        </BrowserRouter>
        <GlobalStyle />
      </IntlProvider>
    </QueryClientProvider>
  );
}

const Routes = () => {
  const elements = useRoutes(routes);
  return elements;
};

export default App;
