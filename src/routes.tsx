import { TabBar } from 'antd-mobile';
import { lazy, Suspense } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { ReactComponent as HomeTabAccount } from './assets/home_tab_account.svg';
import { ReactComponent as HomeTabSvg } from './assets/home_tab_cropyme.svg';
import { ReactComponent as HomeTabFollow } from './assets/home_tab_follow.svg';
import { ReactComponent as HomeTabMarkSvg } from './assets/home_tab_mark.svg';
import { ReactComponent as HomeTabMineSvg } from './assets/home_tab_mine.svg';

const Community = lazy(() => import('./pages/Community'));
const SettingAccount = lazy(() => import('./pages/Settings/Account'));
const AddBankPay = lazy(() => import('./pages/ReceiptList/AddBankPay'));
const AddReceipt = lazy(() => import('./pages/ReceiptList/AddReceipt'));
const ReceiptList = lazy(() => import('./pages/ReceiptList'));
const OtcOrderHistory = lazy(() => import('./pages/OtcOrderHistory'));
const LegalMoney = lazy(() => import('./pages/LegalMoney/LegalMoney'));
const TakeCoinHistoryDetails = lazy(() => import('./pages/My/TakeCoinHistoryDetails'));
const TakeCoinHistory = lazy(() => import('./pages/My/TakeCoinHistory'));
// 劃轉
const TransferCoin = lazy(() => import('./pages/TransferCoin/TransferCoin'));
const TransferCoinHistory = lazy(() => import('./pages/TransferCoin/TransferCoinHistory'));
//
const TakeCoin = lazy(() => import('./pages/My/TakeCoin'));
const RechargeCoin = lazy(() => import('./pages/My/RechargeCoin'));
const Notifications = lazy(() => import('./pages/My/Notifications'));
const ChangePassword = lazy(() => import('./pages/My/ChangePassword'));
const EmailAuth = lazy(() => import('./pages/My/EmailAuth'));
const EmailAuthCode = lazy(() => import('./pages/My/EmailAuth/EmailAuthCode'));
const BindEmail = lazy(() => import('./pages/My/EmailAuth/BindEmail'));
const BindEmailCode = lazy(() => import('./pages/My/EmailAuth/BindEmailCode'));
const Personal = lazy(() => import('./pages/Settings/Personal'));
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
    icon: <HomeTabSvg className="h-6" />,
  },
  {
    key: '/todo',
    title: '行情',
    icon: <HomeTabMarkSvg className="h-6" />,
  },
  {
    key: '/account',
    title: '账户',
    icon: <HomeTabAccount className="h-6" />,
  },
  {
    key: '/community',
    title: '社区',
    icon: <HomeTabFollow className="h-6" />,
  },
  {
    key: '/my',
    title: '我的',
    icon: <HomeTabMineSvg className="h-6" />,
  },
];

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Container className="h-screen relative flex flex-col">
      <div className="content flex flex-col">
        <Outlet />
      </div>
      <TabBar
        activeKey={location.pathname}
        onChange={(key) => {
          navigate(key);
        }}
        className="layout bottom-0 w-full bg-white"
      >
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </Container>
  );
};

const Container = styled.div`
  .content {
    height: calc(100vh - 50px);
  }
`;

export const routes = [
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
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Community />
          </Suspense>
        ),
      },
      {
        path: 'my',
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <My />
              </Suspense>
            ),
          },
          {
            path: 'settings',
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<div>Loading...</div>}>
                    <Settings />
                  </Suspense>
                ),
              },
              {
                path: 'account',
                element: (
                  <Suspense fallback={<div>Loading...</div>}>
                    <SettingAccount />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: 'personal',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Personal />
              </Suspense>
            ),
          },
        ],
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
    path: 'email-auth',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <EmailAuth />
      </Suspense>
    ),
  },
  {
    path: 'email-auth-code',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <EmailAuthCode />
      </Suspense>
    ),
  },
  {
    path: 'bind-email',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <BindEmail />
      </Suspense>
    ),
  },
  {
    path: 'bind-email-code',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <BindEmailCode />
      </Suspense>
    ),
  },
  {
    path: 'change-password',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ChangePassword />
      </Suspense>
    ),
  },
  {
    path: 'notifications',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Notifications />
      </Suspense>
    ),
  },
  {
    path: 'transfer-coin',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <TransferCoin />
      </Suspense>
    ),
  },
  {
    path: 'transfer-coin-history',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <TransferCoinHistory />
      </Suspense>
    ),
  },
  {
    path: 'recharge-coin',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <RechargeCoin />
      </Suspense>
    ),
  },
  {
    path: 'take-coin',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <TakeCoin />
      </Suspense>
    ),
  },
  {
    path: 'take-coin-history',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <TakeCoinHistory />
      </Suspense>
    ),
  },
  {
    path: 'take-coin-history-details',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <TakeCoinHistoryDetails />
      </Suspense>
    ),
  },
  {
    path: 'legal-money',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <LegalMoney />
      </Suspense>
    ),
  },
  {
    path: 'otc-order-history',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <OtcOrderHistory />
      </Suspense>
    ),
  },
  {
    path: 'receipt-list',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ReceiptList />
      </Suspense>
    ),
  },
  {
    path: 'add-receipt',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AddReceipt />
      </Suspense>
    ),
  },
  {
    path: 'add-bank-pay',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AddBankPay />
      </Suspense>
    ),
  },
];

export default routes;
