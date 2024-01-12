import { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

import PrivateRoute from './auth/PrivateRoute';
import { TabLayout } from './components/TabLayout';
import { AdvancedCertification } from './pages/AdvancedCertification';
import { Landing } from './pages/Home/Landing';
import { PrimaryCertification } from './pages/PrimaryCertification';

const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const SettingPayPassword = lazy(() => import('./pages/SettingPayPassword'));
const SearchCoin = lazy(() => import('./pages/SearchCoin'));
const SubscribeDetail = lazy(() => import('./pages/Subscribe/SubscribeDetail'));
const Subscribe = lazy(() => import('./pages/Subscribe'));
const LeverInfo = lazy(() => import('./pages/LeverInfo'));
const ApplyBindAccount = lazy(() => import('./pages/UserHome/ApplyBindAccount'));
const RadarSummary = lazy(() => import('./pages/UserHome/RadarSummary'));
const UserHome = lazy(() => import('./pages/UserHome'));
const Institution = lazy(() => import('./pages/Institution'));
const AddressAdd = lazy(() => import('./pages/Addresses/AddressAdd'));
const Addresses = lazy(() => import('./pages/Addresses'));
const PositionDetails = lazy(() => import('./pages/HomeAccount/PositionDetails'));
const PledgeHistory = lazy(() => import('./pages/Pledge/PledgeHistory'));
const Pledge = lazy(() => import('./pages/Pledge'));
const Language = lazy(() => import('./pages/Language'));
const TradeLever2 = lazy(() => import('./pages/TradeLever2'));
const TradeLever = lazy(() => import('./pages/TradeLever'));

const Market2 = lazy(() => import('./pages/Market2'));
const Market = lazy(() => import('./pages/Market'));
const AddAd = lazy(() => import('./pages/MyAdList/AddAd'));
const MyAdList = lazy(() => import('./pages/MyAdList'));
const MerchantAuthentication = lazy(() => import('./pages/MerchantAuthentication'));
const LegalPay = lazy(() => import('./pages/LegalPay'));
const OtcAppeal = lazy(() => import('./pages/OtcAppeal'));
const LegalOrderInfo = lazy(() => import('./pages/LegalOrderInfo'));
const OtcChat = lazy(() => import('./pages/Chat/OtcChat'));
const Chat = lazy(() => import('./pages/Chat'));
const AnonymousChat = lazy(() => import('./pages/Chat/AnonymousChat'));
const VerifiedResult = lazy(() => import('./pages/Verified/VerifiedResult'));
const Verified = lazy(() => import('./pages/Verified'));
const TransactionRecords = lazy(() => import('./pages/TransactionRecords'));
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
  return (
    <TabLayout>
      <Switch>
        <Route path="/home" exact>
          <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
            <Home />
          </Suspense>
        </Route>
        <Route path="/home/market">
          <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
            <HomeMarket />
          </Suspense>
        </Route>
        <PrivateRoute path="/home/account">
          <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
            <HomeAccount />
          </Suspense>
        </PrivateRoute>
        <PrivateRoute path="/home/community">
          <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
            <Community />
          </Suspense>
        </PrivateRoute>
        <PrivateRoute path="/home/my">
          <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
            <My />
          </Suspense>
        </PrivateRoute>
      </Switch>
    </TabLayout>
  );
};

export const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <Landing />
      </Route>

      <Route path="/primary-certification">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <PrimaryCertification />
        </Suspense>
      </Route>
      <Route path="/advanced-certification">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <AdvancedCertification />
        </Suspense>
      </Route>

      <Route path="/home">
        <HomeTabs />
      </Route>

      <Route path="/help-center">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <HelpCenter />
        </Suspense>
      </Route>

      <Route path="/setting-pay-password">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <SettingPayPassword />
        </Suspense>
      </Route>

      <Route path="/search-coin">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <SearchCoin />
        </Suspense>
      </Route>

      <Route path="/subscribe-detail">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <SubscribeDetail />
        </Suspense>
      </Route>

      <Route path="/subscribe">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <Subscribe />
        </Suspense>
      </Route>

      <Route path="/lever-info">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <LeverInfo />
        </Suspense>
      </Route>

      <Route path="/apply-bind-account">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <ApplyBindAccount />
        </Suspense>
      </Route>

      <Route path="/radar-summary">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <RadarSummary />
        </Suspense>
      </Route>

      <Route path="/user-home">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <UserHome />
        </Suspense>
      </Route>

      <Route path="/institution">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <Institution />
        </Suspense>
      </Route>

      <Route path="/addresses" exact>
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <Addresses />
        </Suspense>
      </Route>

      <Route path="/addresses/add">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <AddressAdd />
        </Suspense>
      </Route>

      <Route path="/position-details">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <PositionDetails />
        </Suspense>
      </Route>

      <Route path="/pledge-history">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <PledgeHistory />
        </Suspense>
      </Route>

      <Route path="/pledge">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <Pledge />
        </Suspense>
      </Route>

      <Route path="/languages">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <Language />
        </Suspense>
      </Route>

      <Route path="/trade-lever2">
        <TabLayout>
          <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
            <TradeLever2 />
          </Suspense>
        </TabLayout>
      </Route>

      <Route path="/trade-lever">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <TradeLever />
        </Suspense>
      </Route>

      <Route path="/market2">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <Market2 />
        </Suspense>
      </Route>
      <Route path="/market">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <Market />
        </Suspense>
      </Route>

      <Route path="/add-ad">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <AddAd />
        </Suspense>
      </Route>

      <Route path="/my-ad-list">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <MyAdList />
        </Suspense>
      </Route>

      <Route path="/merchant-authentication">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <MerchantAuthentication />
        </Suspense>
      </Route>

      <Route path="/settings">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <Settings />
        </Suspense>
      </Route>

      <Route path="/account">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <SettingAccount />
        </Suspense>
      </Route>

      <Route path="/personal">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <Personal />
        </Suspense>
      </Route>

      <Route path="/chat">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <Chat />
        </Suspense>
      </Route>

      <Route path="/otc-chat">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <OtcChat />
        </Suspense>
      </Route>

      <Route path="/anonymous-chat">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <AnonymousChat />
        </Suspense>
      </Route>

      <Route path="/legal-pay">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <LegalPay />
        </Suspense>
      </Route>

      <Route path="/otc-appeal">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <OtcAppeal />
        </Suspense>
      </Route>

      <Route path="/legal-order-info">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <LegalOrderInfo />
        </Suspense>
      </Route>

      <Route path="/verified">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <Verified />
        </Suspense>
      </Route>

      <Route path="/verified-result">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <VerifiedResult />
        </Suspense>
      </Route>

      <Route path="/transaction-records">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <TransactionRecords />
        </Suspense>
      </Route>

      <Route path="/login">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <Login />
        </Suspense>
      </Route>

      <Route path="/signup">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <Signup />
        </Suspense>
      </Route>

      <Route path="/reset-password">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <ResetPassword />
        </Suspense>
      </Route>

      <Route path="/captcha">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <Captcha />
        </Suspense>
      </Route>

      <Route path="/email-auth">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <EmailAuth />
        </Suspense>
      </Route>

      <Route path="/email-auth-code">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <EmailAuthCode />
        </Suspense>
      </Route>

      <Route path="/bind-email">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <BindEmail />
        </Suspense>
      </Route>

      <Route path="/bind-email-code">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <BindEmailCode />
        </Suspense>
      </Route>

      <Route path="/change-password">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <ChangePassword />
        </Suspense>
      </Route>

      <Route path="/notifications">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <Notifications />
        </Suspense>
      </Route>

      <Route path="/transfer-coin">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <TransferCoin />
        </Suspense>
      </Route>

      <Route path="/transfer-coin-history">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <TransferCoinHistory />
        </Suspense>
      </Route>

      <Route path="/recharge-coin">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <RechargeCoin />
        </Suspense>
      </Route>

      <Route path="/take-coin">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <TakeCoin />
        </Suspense>
      </Route>

      <Route path="/take-coin-history">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <TakeCoinHistory />
        </Suspense>
      </Route>

      <Route path="/take-coin-history-details">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <TakeCoinHistoryDetails />
        </Suspense>
      </Route>

      <Route path="/legal-money" exact>
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <LegalMoney />
        </Suspense>
      </Route>

      <Route path="/otc-order-history">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <OtcOrderHistory />
        </Suspense>
      </Route>

      <Route path="/receipt-list">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <ReceiptList />
        </Suspense>
      </Route>

      <Route path="/add-receipt">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <AddReceipt />
        </Suspense>
      </Route>

      <Route path="/add-bank-pay">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <AddBankPay />
        </Suspense>
      </Route>

      <Route path="/bind-phone">
        <Suspense fallback={<div className="dark:bg-[#161720]">Loading...</div>}>
          <BindPhone />
        </Suspense>
      </Route>
    </Switch>
  );
};

export default Routes;
