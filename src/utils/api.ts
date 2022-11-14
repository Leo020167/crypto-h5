import md5 from 'js-md5';
import { ChangePasswordInput, Register } from '../model';
import { apiPost } from './request';

export const outDragImage = () => {
  return apiPost('/security/outDragImg.do', {});
};

export const checkDragImg = (locationX: number, dragImgKey: string) => {
  return apiPost('/security/checkDragImg.do', {
    locationx: locationX,
    dragImgKey,
  });
};
export const getAreaList = () => {
  return apiPost('/area/list.do', {});
};

export const getSms = (data: {
  countryCode: string;
  dragImgKey: string;
  locationx: number;
  sendAddr: string;
  type: number; // 1, 手机，2，邮箱
}) => {
  return apiPost('/sms/get.do', { ...data, platform: 'web' });
};

export const doSecurityRegister = (data: Register) => {
  return apiPost('/security/register.do', {
    ...data,
    userPass: md5(data.userPass ?? ''),
    configUserPass: md5(data.configUserPass ?? ''),
  });
};

export const doSecurityLogin = (data: {
  dragImgKey: string;
  email?: string;
  locationx: number;
  phone: string;
  type: number;
  userPass: string;
}) => {
  return apiPost('/security/login.do', {
    ...data,
    userPass: md5(data.userPass ?? ''),
    platform: 'web',
    smsCode: '',
  });
};

export const doSecurityLogout = () => {
  return apiPost('/security/loginOut.do', {});
};

export const doSecurityForgetPass = (data: {
  dragImgKey: string;
  locationx: number;
  phone: string;
  smsCode: string;
  userPass: string;
}) => {
  return apiPost('/security/forgetPass.do', {
    platform: 'web',
    userPass: md5(data.userPass),
  });
};

export const getHomeAccount = (userId: string) => {
  return apiPost('/home/account.do', { userId, platform: 'web' });
};

export const getUserInfo = () => {
  return apiPost('/user/info.do', {});
};
export const getHomeMy = () => {
  return apiPost('/home/my.do', {});
};

export const userUpdateUserInfo = (data: {
  birthday?: string;
  describes?: string;
  headUrl?: string;
  sex?: '0' | '1';
  userName?: string;
}) => {
  return apiPost('/user/updateUserInfo.do', data);
};

export const getEmail = (email: string) => {
  return apiPost('/email/get.do', {
    platform: 'web',
    email,
  });
};
export const updateEmail = (data: { email: string; code: string }) => {
  return apiPost('/user/security/updateEmail.do', data);
};

export const checkEmailCode = (data: { email: string; code: string }) => {
  return apiPost('/user/security/checkEmailCode.do', data);
};

export const updateUserPass = (data: ChangePasswordInput) => {
  return apiPost('/user/security/updateUserPass.do', {
    oldUserPass: md5(data.oldUserPass?.trim() ?? ''),
    newUserPass: md5(data.newUserPass?.trim() ?? ''),
    configUserPass: md5(data.configUserPass?.trim() ?? ''),
  });
};

export const checkIdentity = (data: {
  dragImgKey: string;
  locationx: number;
  phone: string;
  smsCode: string;
}) => {
  return apiPost('/user/security/checkIdentity.do', data);
};

export const changePhoneTwo = (data: {
  dragImgKey: string;
  locationx: number;
  newCountryCode: string;
  newPhone: string;
  newSmsCode: string;
  oldPhone: string;
  oldSmsCode: string;
}) => {
  return apiPost('/user/security/changePhoneTwo.do', data);
};
