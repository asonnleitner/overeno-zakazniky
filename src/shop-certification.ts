import type { ApiResponse, OrderDetails, ShopCertificationConfig } from './types'
import { ApiClient } from './api-client'
import { OrderValidator } from './validation'

export class ShopCertification {
  #apiClient: ApiClient
  #orderSent = false

  constructor(config: ShopCertificationConfig) {
    this.#apiClient = new ApiClient({
      apiKey: config.apiKey,
      service: config.service ?? 'CZ',
    })
  }

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
