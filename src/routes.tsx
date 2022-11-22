import { TabBar } from 'antd-mobile';
import { lazy, Suspense } from 'react';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { ReactComponent as HomeTabAccount } from './assets/home_tab_account.svg';
import { ReactComponent as HomeTabSvg } from './assets/home_tab_cropyme.svg';
import { ReactComponent as HomeTabFollow } from './assets/home_tab_follow.svg';
import { ReactComponent as HomeTabMarkSvg } from './assets/home_tab_mark.svg';
import { ReactComponent as HomeTabMineSvg } from './assets/home_tab_mine.svg';

const MerchantAuthentication = lazy(() => import('./pages/MerchantAuthentication'));
const LegalPay = lazy(() => import('./pages/LegalPay'));
const OtcAppeal = lazy(() => import('./pages/OtcAppeal'));
const LegalOrderInfo = lazy(() => import('./pages/LegalOrderInfo'));
const Chat = lazy(() => import('./pages/Chat'));
const VerifiedResult = lazy(() => import('./pages/Verified/VerifiedResult'));
const Verified = lazy(() => import('./pages/Verified'));
const TransactionRecords = lazy(() => import('./pages/TransactionRecords'));
const PhoneAuthCode = lazy(() => import('./pages/PhoneAuthCode'));
const BindPhone = lazy(() => import('./pages/BindPhone'));
const Recharge = lazy(() => import('./pages/Recharge'));
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
const TakeCoin = lazy(() => import('./pages/TakeCoin'));
const RechargeCoin = lazy(() => import('./pages/RechargeCoin'));
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
const HomeIndex = lazy(() => import('./pages/Home'));
const My = lazy(() => import('./pages/My'));

const tabs = [
  {
    key: '/home',
    title: '首页',
    icon: <HomeTabSvg className="h-6" />,
  },
  {
    key: '/home/todo',
    title: '行情',
    icon: <HomeTabMarkSvg className="h-6" />,
  },
  {
    key: '/home/account',
    title: '账户',
    icon: <HomeTabAccount className="h-6" />,
  },
  {
    key: '/home/community',
    title: '社区',
    icon: <HomeTabFollow className="h-6" />,
  },
  {
    key: '/home/my',
    title: '我的',
    icon: <HomeTabMineSvg className="h-6" />,
  },
];

const Home = () => {
  const location = useLocation();
  const history = useHistory();
  return (
    <Container className="h-screen relative flex flex-col">
      <div className="content flex flex-col">
        <Switch>
          <Route path="/home" exact>
            <Suspense fallback={<div>Loading...</div>}>
              <HomeIndex />
            </Suspense>
          </Route>
          <Route path="/home/community">
            <Suspense fallback={<div>Loading...</div>}>
              <Community />
            </Suspense>
          </Route>
          <Route path="/home/my">
            <Suspense fallback={<div>Loading...</div>}>
              <My />
            </Suspense>
          </Route>
        </Switch>
      </div>
      <TabBar
        activeKey={location.pathname}
        onChange={history.push}
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

export const Routes = () => {
  return (
    <Switch>
      <Redirect path="/" to="/home" exact />

      <Route path="/home">
        <Home />
      </Route>

      <Route path="/merchant-authentication">
        <Suspense fallback={<div>Loading...</div>}>
          <MerchantAuthentication />
        </Suspense>
      </Route>

      <Route path="/settings">
        <Suspense fallback={<div>Loading...</div>}>
          <Settings />
        </Suspense>
      </Route>

      <Route path="/account">
        <Suspense fallback={<div>Loading...</div>}>
          <SettingAccount />
        </Suspense>
      </Route>
      <Route path="/personal">
        <Suspense fallback={<div>Loading...</div>}>
          <Personal />
        </Suspense>
      </Route>
      <Route path="/chat">
        <Suspense fallback={<div>Loading...</div>}>
          <Chat />
        </Suspense>
      </Route>
      <Route path="/legal-pay">
        <Suspense fallback={<div>Loading...</div>}>
          <LegalPay />
        </Suspense>
      </Route>
      <Route path="/otc-appeal">
        <Suspense fallback={<div>Loading...</div>}>
          <OtcAppeal />
        </Suspense>
      </Route>
      <Route path="/legal-order-info">
        <Suspense fallback={<div>Loading...</div>}>
          <LegalOrderInfo />
        </Suspense>
      </Route>
      <Route path="/verified">
        <Suspense fallback={<div>Loading...</div>}>
          <Verified />
        </Suspense>
      </Route>
      <Route path="/verified-result">
        <Suspense fallback={<div>Loading...</div>}>
          <VerifiedResult />
        </Suspense>
      </Route>
      <Route path="/transaction-records">
        <Suspense fallback={<div>Loading...</div>}>
          <TransactionRecords />
        </Suspense>
      </Route>
      <Route path="/login">
        <Suspense fallback={<div>Loading...</div>}>
          <Login />
        </Suspense>
      </Route>
      <Route path="/signup">
        <Suspense fallback={<div>Loading...</div>}>
          <Signup />
        </Suspense>
      </Route>
      <Route path="/reset-password">
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPassword />
        </Suspense>
      </Route>
      <Route path="/captcha">
        <Suspense fallback={<div>Loading...</div>}>
          <Captcha />
        </Suspense>
      </Route>
      <Route path="/email-auth">
        <Suspense fallback={<div>Loading...</div>}>
          <EmailAuth />
        </Suspense>
      </Route>
      <Route path="/email-auth-code">
        <Suspense fallback={<div>Loading...</div>}>
          <EmailAuthCode />
        </Suspense>
      </Route>
      <Route path="/bind-email">
        <Suspense fallback={<div>Loading...</div>}>
          <BindEmail />
        </Suspense>
      </Route>
      <Route path="/bind-email-code">
        <Suspense fallback={<div>Loading...</div>}>
          <BindEmailCode />
        </Suspense>
      </Route>
      <Route path="/change-password">
        <Suspense fallback={<div>Loading...</div>}>
          <ChangePassword />
        </Suspense>
      </Route>
      <Route path="/notifications">
        <Suspense fallback={<div>Loading...</div>}>
          <Notifications />
        </Suspense>
      </Route>
      <Route path="/transfer-coin">
        <Suspense fallback={<div>Loading...</div>}>
          <TransferCoin />
        </Suspense>
      </Route>
      <Route path="/transfer-coin-history">
        <Suspense fallback={<div>Loading...</div>}>
          <TransferCoinHistory />
        </Suspense>
      </Route>
      <Route path="/recharge-coin">
        <Suspense fallback={<div>Loading...</div>}>
          <RechargeCoin />
        </Suspense>
      </Route>
      <Route path="/take-coin">
        <Suspense fallback={<div>Loading...</div>}>
          <TakeCoin />
        </Suspense>
      </Route>
      <Route path="/take-coin-history">
        <Suspense fallback={<div>Loading...</div>}>
          <TakeCoinHistory />
        </Suspense>
      </Route>
      <Route path="/take-coin-history-details">
        <Suspense fallback={<div>Loading...</div>}>
          <TakeCoinHistoryDetails />
        </Suspense>
      </Route>
      <Route path="/legal-money" exact>
        <Suspense fallback={<div>Loading...</div>}>
          <LegalMoney />
        </Suspense>
      </Route>
      <Route path="/otc-order-history">
        <Suspense fallback={<div>Loading...</div>}>
          <OtcOrderHistory />
        </Suspense>
      </Route>
      <Route path="/receipt-list">
        <Suspense fallback={<div>Loading...</div>}>
          <ReceiptList />
        </Suspense>
      </Route>
      <Route path="/add-receipt">
        <Suspense fallback={<div>Loading...</div>}>
          <AddReceipt />
        </Suspense>
      </Route>
      <Route path="/add-bank-pay">
        <Suspense fallback={<div>Loading...</div>}>
          <AddBankPay />
        </Suspense>
      </Route>
      <Route path="/recharge">
        <Suspense fallback={<div>Loading...</div>}>
          <Recharge />
        </Suspense>
      </Route>
      <Route path="/bind-phone">
        <Suspense fallback={<div>Loading...</div>}>
          <BindPhone />
        </Suspense>
      </Route>
      <Route path="/phone-auth-code">
        <Suspense fallback={<div>Loading...</div>}>
          <PhoneAuthCode />
        </Suspense>
      </Route>
    </Switch>
  );
};

export default Routes;
