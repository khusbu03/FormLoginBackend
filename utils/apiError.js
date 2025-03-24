class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    if (!ApiError.instance) {
      this.message = message;
      this.statusCode = statusCode;
      this.success = false;
      ApiError.instance = this;
    }
    return ApiError.instance;
  }
}

module.exports = ApiError;
