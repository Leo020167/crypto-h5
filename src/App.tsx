import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';
import { localeAtom, tokenAtom, userAtom } from './atoms';
import routes from './routes';
import { getUserInfo } from './utils/api';

const router = createHashRouter(routes);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

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
        <RouterProvider router={router} />
        <GlobalStyle />
      </IntlProvider>
    </QueryClientProvider>
  );
}

export default App;
