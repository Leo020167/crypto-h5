/**
 * Generated by orval v6.14.4 🍺
 * Do not edit manually.
 * API Title
 * OpenAPI spec version: 1.0
 */
import type { ProOrderQueryListItemCloseDetailsItem } from './proOrderQueryListItemCloseDetailsItem';

export interface ProOrderQueryListItem {
  buySell?: string;
  buySellValue?: string;
  closeDetails?: ProOrderQueryListItemCloseDetailsItem[];
  closeDone?: string;
  closeFee?: string;
  closePrice?: string;
  closeState?: string;
  closeStateDesc?: string;
  closeTime?: string;
  multiNum?: string;
  nowStateDesc?: string;
  openBail?: string;
  openDone?: string;
  openFee?: string;
  openHand?: string;
  openPrice?: string;
  openState?: string;
  openStateDesc?: string;
  openTime?: string;
  orderId?: string;
  price?: string;
  priceDecimals?: string;
  profit?: string;
  profitRate?: string;
  stopLossPrice?: string;
  stopWinPrice?: string;
  symbol?: string;
  symbolName?: string;
  userId?: string;
}
