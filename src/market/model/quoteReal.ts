/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Market API
 * OpenAPI spec version: 1.0
 */
import type { RealBuy } from './realBuy';
import type { RealDeal } from './realDeal';
import type { RealSell } from './realSell';

export interface QuoteReal {
  amount?: string;
  amountDecimals?: string;
  amt?: string;
  balance?: string;
  buys?: RealBuy[];
  currency?: string;
  dealList?: RealDeal[];
  high?: string;
  isTrade?: number;
  last?: string;
  lastCny?: string;
  low?: string;
  marketType?: string;
  name?: string;
  open?: string;
  openMarketStr?: string;
  prefixType?: string;
  priceDecimals?: number;
  rate?: string;
  sells?: RealSell[];
  symbol?: string;
  timestamp?: number;
  usdtRate?: string;
  yesClose?: string;
}