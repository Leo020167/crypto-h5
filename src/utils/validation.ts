import { Toast } from 'antd-mobile';
import { IntlShape } from 'react-intl';

export const validPassword = (intl: IntlShape, password?: string, confirmPassword?: string) => {
  if (!password) {
    Toast.show(intl.formatMessage({ defaultMessage: '請輸入密碼', id: '63r2yf' }));
    return;
  }

  if (password.length < 8 || password.length > 16) {
    Toast.show(intl.formatMessage({ defaultMessage: '密码必须是8 -16位', id: 'xalGPW' }));
    return;
  }

  // if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(password)) {
  //   Toast.show('密碼必須是8–16位數字、字母組合');
  //   return;
  // }

  if (!confirmPassword) {
    Toast.show(intl.formatMessage({ defaultMessage: '請再次輸入密碼', id: '/LMNJ8' }));
    return;
  }

  if (password !== confirmPassword) {
    Toast.show(intl.formatMessage({ defaultMessage: '兩次輸入的密碼不相同', id: 'ADKS8l' }));
    return;
  }

  return true;
};
