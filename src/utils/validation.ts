import { Toast } from 'antd-mobile';

export const validPassword = (password?: string, confirmPassword?: string) => {
  if (!password) {
    Toast.show('請輸入密碼');
    return;
  }

  if (password.length < 8 || password.length > 16) {
    Toast.show('密碼必須是8–16位數字、字母組合');
    return;
  }

  if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(password)) {
    Toast.show('密碼必須是8–16位數字、字母組合');
    return;
  }

  if (!confirmPassword) {
    Toast.show('請再次輸入密碼');
    return;
  }

  if (password !== confirmPassword) {
    Toast.show('兩次輸入的密碼不相同');
    return;
  }

  return true;
};
