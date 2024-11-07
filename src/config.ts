export const API_CONFIG = {
  endpoints: {
    CZ: 'https://api.heureka.cz/shop-certification/v2/',
    SK: 'https://api.heureka.sk/shop-certification/v2/',
  },
  timeout: 5000,
  maxOrderIdLength: 255,
} as const
