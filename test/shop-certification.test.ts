import type { ApiResponse } from '../src'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ShopCertification } from '../src'
import { ApiClient } from '../src/api-client'

class MockApiClient {
  post = vi.fn()
}

vi.mock('../src/api-client', () => ({
  ApiClient: vi.fn().mockImplementation(() => new MockApiClient()),
}))

describe('shopCertification', () => {
  let mockApiClient: MockApiClient

  beforeEach(() => {
    vi.clearAllMocks()
    // Get fresh instance of mock for each test
    mockApiClient = new MockApiClient();
    (ApiClient as any).mockImplementation(() => mockApiClient)
  })

  it('throws validation error for invalid order ID length', async () => {
    const shopCertification = new ShopCertification({ apiKey: 'test-key' })

    await expect(shopCertification.logOrder({
      email: 'test@example.com',
      orderId: 'x'.repeat(256),
    })).rejects.toThrowError(/Order ID must not exceed/)
  })

  it('successfully logs order with all fields', async () => {
    const mockResponse: ApiResponse = {
      code: 200,
      message: 'ok',
    }

    // Set up the mock response
    mockApiClient.post.mockResolvedValue(mockResponse)

    const shopCertification = new ShopCertification({ apiKey: 'test-key' })
    const orderDetails = {
      email: 'john@doe.com',
      orderId: '12345',
      productIds: ['ab12345', '123459'],
    }

    const result = await shopCertification.logOrder(orderDetails)

    expect(result).toEqual(mockResponse)
    expect(mockApiClient.post).toHaveBeenCalledWith('order/log', {
      email: orderDetails.email,
      orderId: orderDetails.orderId,
      productItemIds: orderDetails.productIds,
    })
  })

  it('successfully logs order with only required fields', async () => {
    const mockResponse: ApiResponse = { code: 200, message: 'ok' }
    mockApiClient.post.mockResolvedValue(mockResponse)

    const shopCertification = new ShopCertification({ apiKey: 'test-key' })
    const result = await shopCertification.logOrder({ email: 'john@doe.com' })

    expect(result).toEqual(mockResponse)
    expect(mockApiClient.post).toHaveBeenCalledWith('order/log', {
      email: 'john@doe.com',
    })
  })

  it('throws error when email is missing', async () => {
    const shopCertification = new ShopCertification({ apiKey: 'test-key' })

    await expect(
      shopCertification.logOrder({} as any),
    ).rejects.toThrow(/Email is required/)
  })

  it('prevents double sending of orders', async () => {
    const mockResponse: ApiResponse = { code: 200, message: 'ok' }
    mockApiClient.post.mockResolvedValue(mockResponse)

    const shopCertification = new ShopCertification({ apiKey: 'test-key' })
    const orderDetails = {
      email: 'john@doe.com',
      productIds: ['ab12345', '123459'],
    }

    await shopCertification.logOrder(orderDetails)
    await expect(
      shopCertification.logOrder(orderDetails),
    ).rejects.toThrow(/Order already sent/)
  })

  it('uses correct service endpoint based on config', async () => {
    const mockResponse: ApiResponse = { code: 200, message: 'ok' }
    mockApiClient.post.mockResolvedValue(mockResponse)

    const shopCertification = new ShopCertification({
      apiKey: 'test-key',
      service: 'SK',
    })

    await shopCertification.logOrder({ email: 'test@example.com' })

    expect(ApiClient).toHaveBeenCalledWith({
      apiKey: 'test-key',
      service: 'SK',
    })
  })

  it('defaults to CZ service when not specified', async () => {
    const mockResponse: ApiResponse = { code: 200, message: 'ok' }
    mockApiClient.post.mockResolvedValue(mockResponse)

    const shopCertification = new ShopCertification({
      apiKey: 'test-key',
    })

    await shopCertification.logOrder({ email: 'test@example.com' })

    expect(ApiClient).toHaveBeenCalledWith({
      apiKey: 'test-key',
      service: 'CZ',
    })
  })
})
