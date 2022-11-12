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
