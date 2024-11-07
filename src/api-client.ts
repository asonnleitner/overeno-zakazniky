import type { HeurekaService } from './types'
import { API_CONFIG } from './config'
import { ApiError } from './errors'

/**
 * Options for configuring the API client
 * @interface ApiClientOptions
 */
export interface ApiClientOptions {
  /** API key for authentication */
  apiKey: string
  /** Service region identifier */
  service: HeurekaService
  /** Request timeout in milliseconds */
  timeout?: number
}

/**
 * HTTP client for communicating with Heureka API
 * @internal
 */
export class ApiClient {
  readonly #baseUrl: string
  readonly #timeout: number

  /**
   * Creates a new API client instance
   * @param {ApiClientOptions} options - Client configuration options
   */
  constructor(private readonly options: ApiClientOptions) {
    this.#baseUrl = API_CONFIG.endpoints[options.service]
    this.#timeout = options.timeout ?? API_CONFIG.timeout
  }

  /**
   * Sends a POST request to Heureka API
   * @param {string} path - API endpoint path
   * @param {Record<string, unknown>} data - Request payload
   * @returns {Promise<T>} API response
   * @throws {ApiError} When request fails or returns non-200 status
   * @template T Response type
   */
  async post<T>(path: string, data: Record<string, unknown>): Promise<T> {
    const url = new URL(path, this.#baseUrl)

    try {
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.options.apiKey}`,
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(this.#timeout),
      })

      if (!response.ok)
        throw new ApiError(response.status, `API request failed: ${response.statusText}`)

      const result = await response.json()
      return result as T
    }
    catch (error) {
      if (error instanceof ApiError)
        throw error
      throw new ApiError(500, `Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
