export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: any[]
  ) {
    super(message);
  }

  static BadRequest(message: string, errors?: any[]) {
    return new ApiError(400, message, errors);
  }

  static NotFound(message: string = "Not found") {
    return new ApiError(404, message);
  }

  static Internal(message: string = "Internal server error") {
    return new ApiError(500, message);
  }
}
