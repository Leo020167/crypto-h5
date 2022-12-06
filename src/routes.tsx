import { TabBar } from 'antd-mobile';
import { lazy, Suspense, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { ReactComponent as HomeTabAccount } from './assets/home_tab_account.svg';
import { ReactComponent as HomeTabSvg } from './assets/home_tab_cropyme.svg';
import { ReactComponent as HomeTabFollow } from './assets/home_tab_follow.svg';
import { ReactComponent as HomeTabMarkSvg } from './assets/home_tab_mark.svg';
import { ReactComponent as HomeTabMineSvg } from './assets/home_tab_mine.svg';
import PrivateRoute from './auth/PrivateRoute';

const LeverInfo = lazy(() => import('./pages/LeverInfo'));
const ApplyBindAccount = lazy(() => import('./pages/UserHome/ApplyBindAccount'));
const RadarSummary = lazy(() => import('./pages/UserHome/RadarSummary'));
const UserHome = lazy(() => import('./pages/UserHome'));
const Institution = lazy(() => import('./pages/Institution'));
const AddressAdd = lazy(() => import('./pages/AddressManagement/AddressAdd'));
const AddressManagement = lazy(() => import('./pages/AddressManagement'));
const Addresses = lazy(() => import('./pages/Addresses'));
const PositionDetails = lazy(() => import('./pages/HomeAccount/PositionDetails'));
const PledgeHistory = lazy(() => import('./pages/Pledge/PledgeHistory'));
const Pledge = lazy(() => import('./pages/Pledge'));
const Language = lazy(() => import('./pages/Language'));
const TradeLever = lazy(() => import('./pages/TradeLever'));
const Trade = lazy(() => import('./pages/Trade'));
const Market = lazy(() => import('./pages/Market'));
const AddAd = lazy(() => import('./pages/MyAdList/AddAd'));
const MyAdList = lazy(() => import('./pages/MyAdList'));
const MerchantAuthentication = lazy(() => import('./pages/MerchantAuthentication'));
const LegalPay = lazy(() => import('./pages/LegalPay'));
const OtcAppeal = lazy(() => import('./pages/OtcAppeal'));
const LegalOrderInfo = lazy(() => import('./pages/LegalOrderInfo'));
const OtcChat = lazy(() => import('./pages/Chat/OtcChat'));
const Chat = lazy(() => import('./pages/Chat'));
const VerifiedResult = lazy(() => import('./pages/Verified/VerifiedResult'));
const Verified = lazy(() => import('./pages/Verified'));
const TransactionRecords = lazy(() => import('./pages/TransactionRecords'));
const PhoneAuthCode = lazy(() => import('./pages/PhoneAuthCode'));
const BindPhone = lazy(() => import('./pages/BindPhone'));
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
const My = lazy(() => import('./pages/My'));

// Home

const HomeMarket = lazy(() => import('./pages/HomeMarket'));
const HomeAccount = lazy(() => import('./pages/HomeAccount'));
const Home = lazy(() => import('./pages/Home'));

const HomeTabs = () => {
  const location = useLocation();
  const history = useHistory();

  const intl = useIntl();

  const tabs = useMemo(
    () => [
      {
        key: '/home',
        title: intl.formatMessage({ defaultMessage: '首頁', id: 'bsSd3V' }),
        icon: <HomeTabSvg className="h-6" />,
      },
      {
        key: '/home/market',
        title: intl.formatMessage({ defaultMessage: '行情', id: 'Hv1Nr8' }),
        icon: <HomeTabMarkSvg className="h-6" />,
      },
      {
        key: '/home/account',
        title: intl.formatMessage({ defaultMessage: '賬戶', id: 'R4Ww2H' }),
        icon: <HomeTabAccount className="h-6" />,
      },
      {
        key: '/home/community',
        title: intl.formatMessage({ defaultMessage: '社區', id: 'LJ33pi' }),
        icon: <HomeTabFollow className="h-6" />,
      },
      {
        key: '/home/my',
        title: intl.formatMessage({ defaultMessage: '我的', id: '/I+pby' }),
        icon: <HomeTabMineSvg className="h-6" />,
      },
    ],
    [intl],
  );

  return (
    <Container className="h-screen relative flex flex-col">
      <div className="content flex flex-col">
        <Switch>
          <Route path="/home" exact>
            <Suspense fallback={<div>Loading...</div>}>
              <Home />
            </Suspense>
          </Route>
          <Route path="/home/market">
            <Suspense fallback={<div>Loading...</div>}>
              <HomeMarket />
            </Suspense>
          </Route>
          <PrivateRoute path="/home/account">
            <Suspense fallback={<div>Loading...</div>}>
              <HomeAccount />
            </Suspense>
          </PrivateRoute>
          <PrivateRoute path="/home/community">
            <Suspense fallback={<div>Loading...</div>}>
              <Community />
            </Suspense>
          </PrivateRoute>
          <PrivateRoute path="/home/my">
            <Suspense fallback={<div>Loading...</div>}>
              <My />
            </Suspense>
          </PrivateRoute>
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
        <HomeTabs />
      </Route>

      <Route path="/lever-info">
        <Suspense fallback={<div>Loading...</div>}>
          <LeverInfo />
        </Suspense>
      </Route>

      <Route path="/apply-bind-account">
        <Suspense fallback={<div>Loading...</div>}>
          <ApplyBindAccount />
        </Suspense>
      </Route>

      <Route path="/radar-summary">
        <Suspense fallback={<div>Loading...</div>}>
          <RadarSummary />
        </Suspense>
      </Route>

      <Route path="/user-home">
        <Suspense fallback={<div>Loading...</div>}>
          <UserHome />
        </Suspense>
      </Route>

      <Route path="/institution">
        <Suspense fallback={<div>Loading...</div>}>
          <Institution />
        </Suspense>
      </Route>

      <Route path="/addresses">
        <Suspense fallback={<div>Loading...</div>}>
          <Addresses />
        </Suspense>
      </Route>

      <Route path="/address-management" exact>
        <Suspense fallback={<div>Loading...</div>}>
          <AddressManagement />
        </Suspense>
      </Route>

      <Route path="/address-management/add">
        <Suspense fallback={<div>Loading...</div>}>
          <AddressAdd />
        </Suspense>
      </Route>

      <Route path="/position-details">
        <Suspense fallback={<div>Loading...</div>}>
          <PositionDetails />
        </Suspense>
      </Route>

      <Route path="/pledge-history">
        <Suspense fallback={<div>Loading...</div>}>
          <PledgeHistory />
        </Suspense>
      </Route>

      <Route path="/pledge">
        <Suspense fallback={<div>Loading...</div>}>
          <Pledge />
        </Suspense>
      </Route>

      <Route path="/languages">
        <Suspense fallback={<div>Loading...</div>}>
          <Language />
        </Suspense>
      </Route>

      <Route path="/trade-lever">
        <Suspense fallback={<div>Loading...</div>}>
          <TradeLever />
        </Suspense>
      </Route>

      <Route path="/trade">
        <Suspense fallback={<div>Loading...</div>}>
          <Trade />
        </Suspense>
      </Route>

      <Route path="/market">
        <Suspense fallback={<div>Loading...</div>}>
          <Market />
        </Suspense>
      </Route>

      <Route path="/add-ad">
        <Suspense fallback={<div>Loading...</div>}>
          <AddAd />
        </Suspense>
      </Route>

      <Route path="/my-ad-list">
        <Suspense fallback={<div>Loading...</div>}>
          <MyAdList />
        </Suspense>
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

      <Route path="/otc-chat">
        <Suspense fallback={<div>Loading...</div>}>
          <OtcChat />
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
