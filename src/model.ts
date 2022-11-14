export interface AreaListItem {
  areaCode: string;
  deName: string;
  enName: string;
  tcName: string;
}

export interface Register {
  configUserPass?: string;
  countryCode?: string;
  dragImgKey?: string;
  email?: string;
  inviteCode?: string;
  locationx?: number;
  phone?: string;
  platform?: string;
  smsCode?: string;
  type: 1 | 2;
  userName?: string;
  userPass?: string;
  sex?: number;
}

export interface User {
  adminType: string;
  agencyCode: string;
  countryCode: string;
  createTime: string;
  headUrl: string;
  idCertify: string;
  inviteUid: string;
  isLock: string;
  isMark: string;
  isStop: string;
  isVip: string;
  lastIp: string;
  lastLogin: string;
  memberCode: string;
  passErrNum: string;
  phone: string;
  regPlatform: string;
  sex: '0' | '1';
  synSign: string;
  synVersion: string;
  userId: string;
  userName: string;
  userPass: string;
  verifySql: string;
  verifySqlTime: string;
  version: string;
  describes?: string;
}
