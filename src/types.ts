/**
 * Represents the supported Heureka service regions
 * @type {HeurekaService}
 */
export type HeurekaService = 'CZ' | 'SK'

/**
 * Configuration options for initializing ShopCertification
 * @interface ShopCertificationConfig
 */
export interface ShopCertificationConfig {
  /** API key obtained from Heureka service dashboard */
  apiKey: string
  /** Service region identifier. Defaults to 'CZ' if not specified */
  service?: HeurekaService
}

/**
 * Details of an order to be logged in Heureka system
 * @interface OrderDetails
 */
export interface OrderDetails {
  /** Customer's email address */
  email: string
  /** Unique order identifier (max 255 characters) */
  orderId?: string
  /** Array of product IDs that match the ITEM_ID in Heureka XML feed */
  productIds?: string[]
}

/**
 * Structure of API response from Heureka service
 * @interface ApiResponse
 */
export interface ApiResponse {
  /** HTTP status code */
  code: number
  /** Status message */
  message: string
  /** Optional detailed description */
  description?: string
  /** Optional resource identifier */
  resourceId?: string
}
