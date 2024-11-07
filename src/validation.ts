import type { OrderDetails } from './types'
import { API_CONFIG } from './config'
import { ValidationError } from './errors'

export class OrderValidator {
  static validate(order: OrderDetails): void {
    if (!order.email?.trim())
      throw new ValidationError('Email is required')

    if (!this.#isValidEmail(order.email))
      throw new ValidationError('Invalid email format')

    if (order.orderId && order.orderId.length > API_CONFIG.maxOrderIdLength)
      throw new ValidationError(`Order ID must not exceed ${API_CONFIG.maxOrderIdLength} characters`)

    if (order.productIds?.length) {
      const uniqueIds = new Set(order.productIds)
      if (uniqueIds.size !== order.productIds.length)
        throw new ValidationError('Duplicate product IDs are not allowed')
    }
  }

  static #isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email)
}
