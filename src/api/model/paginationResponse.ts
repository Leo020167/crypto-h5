/**
 * Generated by orval v6.12.0 🍺
 * Do not edit manually.
 * API Title
 * OpenAPI spec version: 1.0
 */
import type { PaginationResponseDataItem } from './paginationResponseDataItem';

export interface PaginationResponse {
  buttons: string;
  data?: PaginationResponseDataItem[];
  pageNo: string;
  pageSize: string;
  total: string;
}
