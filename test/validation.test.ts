import { describe, expect, it } from 'vitest'
import { API_CONFIG } from '../src/config'
import { OrderValidator } from '../src/validation'

describe('orderValidator', () => {
  it('validates correct order details', () => {
    expect(() =>
      OrderValidator.validate({
        email: 'test@example.com',
        orderId: '123',
        productIds: ['p1', 'p2'],
      }),
    ).not.toThrow()
  })

  it('detects duplicate product IDs', () => {
    expect(() =>
      OrderValidator.validate({
        email: 'test@example.com',
        productIds: ['p1', 'p1'],
      }),
    ).toThrow(/duplicate product IDs/i)
  })

  it('requires email field', () => {
    expect(() =>
      OrderValidator.validate({
        orderId: '123',
      } as any),
    ).toThrow(/email is required/i)
  })

  it('validates order ID length', () => {
    expect(() =>
      OrderValidator.validate({
        email: 'test@example.com',
        orderId: 'x'.repeat(API_CONFIG.maxOrderIdLength + 1),
      }),
    ).toThrow(/order ID .* exceed/i)
  })

  it('allows empty product IDs array', () => {
    expect(() =>
      OrderValidator.validate({
        email: 'test@example.com',
        productIds: [],
      }),
    ).not.toThrow()
  })
})
