import type { OrderDetails } from './types'
import { API_CONFIG } from './config'
import { ValidationError } from './errors'

/**
 * Validates order details before submission to Heureka service
 */
export class OrderValidator {
  /**
   * Validates order details against Heureka service requirements
   * @param {OrderDetails} order - Order details to validate
   * @throws {ValidationError} When validation fails
   */
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

  /**
   * Validates email format
   * @param {string} email - Email address to validate
   * @returns {boolean} True if email format is valid
   * @private
   */
  static #isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email)
}
