class ErrorHandler extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this.constructor);
  }
}

export default ErrorHandler;
