/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * API Title
 * OpenAPI spec version: 1.0
 */
import type { AccountInfo } from './accountInfo';
import type { Banner } from './banner';
import type { FollowDv } from './followDv';

export type HomeAccountResponseAllOfData = {
  balanceAccount?: AccountInfo;
  banner?: Banner[];
  digitalAccount?: AccountInfo;
  followAccount?: AccountInfo;
  followDv?: FollowDv;
  spotAccount?: AccountInfo;
  stockAccount?: AccountInfo;
  tokenAccount?: AccountInfo;
  tolAssets?: string;
  tolAssetsCny?: string;
};
