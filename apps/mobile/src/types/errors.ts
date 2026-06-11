export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class AuthError extends ApiError {
  name = 'AuthError';
  constructor(message = 'Authentication required') {
    super(message, 401);
  }
}

export class NetworkError extends Error {
  name = 'NetworkError';
  constructor(message = 'Network unavailable — check your connection') {
    super(message);
  }
}

export class NotFoundError extends ApiError {
  name = 'NotFoundError';
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}
