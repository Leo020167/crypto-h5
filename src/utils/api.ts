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

export const doSecurityRegister = (data: Register) => {
  return apiPost('/security/register.do', {
    ...data,
    userPass: md5(data.userPass ?? ''),
    configUserPass: md5(data.configUserPass ?? ''),
  });
};

export const doSecurityForgetPass = (data: {
  phone: string;
  smsCode: string;
  userPass: string;
}) => {
  return apiPost('/security/forgetPass.do', {
    platform: 'web',
    userPass: md5(data.userPass),
  });
};

export const userUpdateUserInfo = (data: {
  birthday?: string;
  describes?: string;
  headUrl?: string;
  sex?: string;
  userName?: string;
}) => {
  return apiPost('/user/updateUserInfo.do', data);
};

export const getEmail = (email?: string) => {
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
