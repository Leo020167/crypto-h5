/**
 * Generated by orval v6.11.1 🍺
 * Do not edit manually.
 * API Title
 * OpenAPI spec version: 1.0
 */
import type { Position } from './position';
import type { SymbolListItem } from './symbolListItem';

export interface AccountInfo {
  accountType?: string;
  assets?: string;
  assetsCny?: string;
  disableAmount?: string;
  eableBail?: string;
  frozenAmount?: string;
  frozenBail?: string;
  holdAmount?: string;
  openBail?: string;
  openList?: Position[];
  profit?: string;
  riskRate?: string;
  symbolList?: SymbolListItem[];
}
