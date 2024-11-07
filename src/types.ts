export type HeurekaService = 'CZ' | 'SK'

export interface ShopCertificationConfig {
  apiKey: string
  service?: HeurekaService
}

export interface OrderDetails {
  email: string
  orderId?: string
  productIds?: string[]
}

export interface ApiResponse {
  code: number
  message: string
  description?: string
  resourceId?: string
}
