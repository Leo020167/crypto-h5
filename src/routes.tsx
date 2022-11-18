import { TabBar } from 'antd-mobile';
import { AppOutline, UnorderedListOutline, MessageOutline, UserOutline } from 'antd-mobile-icons';
import { lazy, Suspense } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

const SettingAccount = lazy(() => import('./pages/Settings/Account'));
const AddBankPay = lazy(() => import('./pages/ReceiptList/AddBankPay'));
const AddReceipt = lazy(() => import('./pages/ReceiptList/AddReceipt'));
const ReceiptList = lazy(() => import('./pages/ReceiptList'));
const OtcOrderHistory = lazy(() => import('./pages/OtcOrderHistory'));
const LegalMoney = lazy(() => import('./pages/LegalMoney/LegalMoney'));
const TakeCoinHistoryDetails = lazy(() => import('./pages/My/TakeCoinHistoryDetails'));
const TakeCoinHistory = lazy(() => import('./pages/My/TakeCoinHistory'));
const TransferCoinHistory = lazy(() => import('./pages/My/TransferCoinHistory'));
const TransferCoin = lazy(() => import('./pages/My/TransferCoin'));
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
        element: 'community',
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
