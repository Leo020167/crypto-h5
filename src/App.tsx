import { TabBar } from 'antd-mobile';
import { AppOutline, UnorderedListOutline, MessageOutline, UserOutline } from 'antd-mobile-icons';
import { useAtomValue } from 'jotai';
import { lazy, Suspense, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import {
  createHashRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { localeAtom } from './atoms';

const Home = lazy(() => import('./pages/Home'));

const tabs = [
  {
    key: '/home',
    title: '首页',
    icon: <AppOutline />,
  },
  {
    key: '/todo',
    title: '行情',
    icon: <UnorderedListOutline />,
  },
  {
    key: '/account',
    title: '账户',
    icon: <MessageOutline />,
  },
  {
    key: '/community',
    title: '社区',
    icon: <UserOutline />,
  },
  {
    key: '/my',
    title: '我的',
    icon: <UserOutline />,
  },
];

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="h-screen relative flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
      <TabBar
        activeKey={location.pathname}
        onChange={(key) => {
          navigate(key);
        }}
        className="bottom-0 w-full bg-white"
      >
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </div>
  );
};

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: 'home',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'todo',
        element: 'todo',
      },
      {
        path: 'account',
        element: 'account',
      },
      {
        path: 'community',
        element: 'community',
      },
      {
        path: 'my',
        element: 'my',
      },
    ],
  },
  {
    path: 'about',
    element: <div>About</div>,
  },
]);

function App() {
  const locale = useAtomValue(localeAtom);

  const [messages, setMessages] = useState<Record<string, string>>();

  useEffect(() => {
    (async () => {
      const mod = await import(`./locale/${locale}.json`);
      setMessages(mod.default);
    })();
  }, [locale]);

  return (
    <IntlProvider locale={locale} defaultLocale="en" key={locale} messages={messages}>
      <RouterProvider router={router} />
    </IntlProvider>
  );
}

export default App;
