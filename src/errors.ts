/**
 * Base error class for Heureka service errors
 * @extends Error
 */
export class HeurekaError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, HeurekaError.prototype)
  }
}

/**
 * Thrown when order details validation fails
 * @extends HeurekaError
 */
export class ValidationError extends HeurekaError {}

/**
 * Thrown when API request fails
 * @extends HeurekaError
 */
export class ApiError extends HeurekaError {
  constructor(public statusCode: number, message: string) {
    super(message)
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}
