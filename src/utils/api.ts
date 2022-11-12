import md5 from 'js-md5';
import { Register } from '../model';
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
