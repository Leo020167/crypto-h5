/**
 * Generated by orval v6.14.4 🍺
 * Do not edit manually.
 * API Title
 * OpenAPI spec version: 1.0
 */

export type IdentitySubmitBody = {
  /** 证件类型编码 */
  certType?: string;
  /** 初级1 高级2，默认1 */
  type?: string;
  /** 证件号码 */
  certNo?: string;
  /** 背面照 */
  backImgUrl?: string;
  /** 正面照 */
  frontImgUrl?: string;
  /** 持证照片 */
  holdImgUrl?: string;
  name: string;
};
