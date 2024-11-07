import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../src'
import { ApiClient } from '../src/api-client'
import { API_CONFIG } from '../src/config'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('makes successful POST request', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ code: 200, message: 'ok' }),
    }
    mockFetch.mockResolvedValueOnce(mockResponse)

    const client = new ApiClient({
      apiKey: 'test-key',
      service: 'CZ',
    })

    const result = await client.post('test/endpoint', { data: 'test' })

    expect(result).toEqual({ code: 200, message: 'ok' })
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(API_CONFIG.endpoints.CZ),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-key',
        }),
      }),
    )
  })

  it('handles network errors properly', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const client = new ApiClient({
      apiKey: 'test-key',
      service: 'CZ',
    })

    await expect(
      client.post('test/endpoint', {}),
    ).rejects.toThrow(ApiError)
  })

  it('handles API errors with proper status codes', async () => {
    const mockResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: () => Promise.resolve({ error: 'Resource not found' }),
    }
    mockFetch.mockResolvedValueOnce(mockResponse)

    const client = new ApiClient({
      apiKey: 'test-key',
      service: 'CZ',
    })

    const error = await client.post('test/endpoint', {}).catch(e => e)

    expect(error).toBeInstanceOf(ApiError)

    expect(error).toMatchObject({
      statusCode: 404,
    })
  })
})
