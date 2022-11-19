import { withDefault, NumberParam } from 'use-query-params';
import Screen from '../../components/Screen';

const TypeParam = withDefault(NumberParam, 0);

const PhoneAuthCode = () => {
  return <Screen>PhoneAuthCode</Screen>;
};

export default PhoneAuthCode;
