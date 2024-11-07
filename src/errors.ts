export class HeurekaError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, HeurekaError.prototype)
  }
}

export class ValidationError extends HeurekaError {}
export class ApiError extends HeurekaError {
  constructor(public statusCode: number, message: string) {
    super(message)
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}
