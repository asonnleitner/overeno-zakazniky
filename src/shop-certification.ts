import type { ApiResponse, OrderDetails, ShopCertificationConfig } from './types'
import { ApiClient } from './api-client'
import { OrderValidator } from './validation'

/**
 * Main client for interacting with Heureka ShopCertification (Ověřeno zákazníky) service.
 * Allows e-commerce websites to log orders for customer satisfaction verification.
 *
 * @example
 * ```ts
 * const client = new ShopCertification({ apiKey: 'your-api-key' });
 *
 * await client.logOrder({
 *   email: 'customer@example.com',
 *   orderId: '12345',
 *   productIds: ['ABC123']
 * });
 * ```
 */
export class ShopCertification {
  #apiClient: ApiClient
  #orderSent = false

  /**
   * Creates a new instance of ShopCertification client
   * @param {ShopCertificationConfig} config - Configuration options
   */
  constructor(config: ShopCertificationConfig) {
    this.#apiClient = new ApiClient({
      apiKey: config.apiKey,
      service: config.service ?? 'CZ',
    })
  }

  /**
   * Logs an order to Heureka service for customer satisfaction review
   * @param {OrderDetails} details - Details of the order to log
   * @returns {Promise<ApiResponse>} Response from Heureka API
   * @throws {ValidationError} When order details fail validation
   * @throws {ApiError} When API request fails
   * @throws {Error} When attempting to log multiple orders with same instance
   */
  async logOrder(details: OrderDetails): Promise<ApiResponse> {
    if (this.#orderSent)
      throw new Error('Order already sent - each OrderService instance can only send one order')

    OrderValidator.validate(details)

    const payload = {
      email: details.email,
      ...(details.orderId && { orderId: details.orderId }),
      ...(details.productIds && { productItemIds: details.productIds }),
    }

    const response = await this.#apiClient.post<ApiResponse>('order/log', payload)
    this.#orderSent = true
    return response
  }
}
