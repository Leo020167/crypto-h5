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
