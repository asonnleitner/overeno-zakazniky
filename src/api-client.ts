import type { HeurekaService } from './types'
import { API_CONFIG } from './config'
import { ApiError } from './errors'

export interface ApiClientOptions {
  apiKey: string
  service: HeurekaService
  timeout?: number
}

export class ApiClient {
  readonly #baseUrl: string
  readonly #timeout: number

  constructor(private readonly options: ApiClientOptions) {
    this.#baseUrl = API_CONFIG.endpoints[options.service]
    this.#timeout = options.timeout ?? API_CONFIG.timeout
  }

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
