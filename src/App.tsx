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
import * as styled from 'styled-components';
import { localeAtom } from './atoms';

const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Settings = lazy(() => import('./pages/Settings'));
const Captcha = lazy(() => import('./pages/Captcha'));
const Signup = lazy(() => import('./pages/Signup'));
const Login = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/Home'));
const My = lazy(() => import('./pages/My'));

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
      <div className="flex-1">
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
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <My />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: 'login',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: 'signup',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Signup />
      </Suspense>
    ),
  },
  {
    path: 'reset-password',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPassword />
      </Suspense>
    ),
  },
  {
    path: 'captcha',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Captcha />
      </Suspense>
    ),
  },
  {
    path: 'settings',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Settings />
      </Suspense>
    ),
  },
]);

const GlobalStyle = styled.createGlobalStyle`
  @font-face {
    font-family: AlibabaPuHuiTi;
    font-weight: 400;
    src: url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-55-Regular/AlibabaPuHuiTi-2-55-Regular.eot)
        format('embedded-opentype'),
      url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-55-Regular/AlibabaPuHuiTi-2-55-Regular.otf)
        format('opentype'),
      url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-55-Regular/AlibabaPuHuiTi-2-55-Regular.ttf)
        format('TrueType'),
      url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-55-Regular/AlibabaPuHuiTi-2-55-Regular.woff)
        format('woff'),
      url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-55-Regular/AlibabaPuHuiTi-2-55-Regular.woff2)
        format('woff2');
  }

  @font-face {
    font-family: AlibabaPuHuiTi;
    font-weight: bold;
    src: url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-85-Bold/AlibabaPuHuiTi-2-85-Bold.eot)
        format('embedded-opentype'),
      url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-85-Bold/AlibabaPuHuiTi-2-85-Bold.otf)
        format('opentype'),
      url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-85-Bold/AlibabaPuHuiTi-2-85-Bold.ttf)
        format('TrueType'),
      url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-85-Bold/AlibabaPuHuiTi-2-85-Bold.woff)
        format('woff'),
      url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-85-Bold/AlibabaPuHuiTi-2-85-Bold.woff2)
        format('woff2');
  }

  :root {
    --adm-color-primary: #6277b0;
  }

  html,
  body {
    margin: 0;
    font-family: AlibabaPuHuiTi, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  }

  button,
  [type='button'],
  [type='reset'],
  [type='submit'] {
    background-color: var(--background-color);
  }

  .adm-nav-bar {
    border-bottom: 1px solid #f6f6f6;
  }

  .adm-form {
    .adm-list-body {
      border: 0;

      .adm-list-item {
        padding-left: 0;
      }

      .adm-list-item-content {
        padding-right: 0;
        border-top: 0;
        border-bottom: var(--border-inner);
      }
    }

    .adm-form-footer {
      padding: 20px 0;
    }
  }
`;

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
      <GlobalStyle />
    </IntlProvider>
  );
}

export default App;
