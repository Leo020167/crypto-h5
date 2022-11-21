import { orderBy } from 'lodash-es';
import { Receipt } from '../api/model';

export enum OtcOrderState {
  wait = '0', //买家：取消、去付款、我已付款成功，卖家：我确认已收到付款（此态暂不可用）
  mark = '1', //买家：从“我已付款成功”点击后->“申诉”，卖家：申诉、我确认已收到付款
  done = '2', //买家：完成，卖家：从“我确认已收到付款”点击后->完成
  appeal = '33', //申诉，mark->appeal
  expire = '-1', //已过期，订单过期不处理
  cancel = '-2', //已撤销，
  admin_cancel = '-3', // 系统撤销
}

export const getReceipts = (value?: string) => {
  let result: Receipt[] = [];
  if (value) {
    try {
      result = JSON.parse(value) as Receipt[];
      result = orderBy(result, ['sort'], ['asc']);
    } catch (error) {
      /* empty */
    }
  }
  return result;
};
