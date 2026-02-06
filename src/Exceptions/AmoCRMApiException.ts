/**
 * Request info type
 */
export interface RequestInfo {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  responseStatus?: number;
  responseHeaders?: Record<string, string>;
  responseBody?: unknown;
}

/**
 * Base exception class for amoCRM API errors
 */
export class AmoCRMApiException extends Error {
  protected errorCode: number;
  protected description: string;
  protected title: string;
  protected lastRequestInfo: RequestInfo;

  constructor(
    message = '',
    code = 0,
    lastRequestInfo: RequestInfo = {},
    description = ''
  ) {
    super(message);
    this.name = 'AmoCRMApiException';
    this.errorCode = code;
    this.title = message;
    this.description = description;
    this.lastRequestInfo = lastRequestInfo;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AmoCRMApiException);
    }
  }

  /**
   * Get the error code
   */
  getErrorCode(): number {
    return this.errorCode;
  }

  /**
   * Set the error code
   */
  setErrorCode(errorCode: number): this {
    this.errorCode = errorCode;
    return this;
  }

  /**
   * Get the error title
   */
  getTitle(): string {
    return this.title;
  }

  /**
   * Set the error title
   */
  setTitle(title: string): this {
    this.title = title;
    return this;
  }

  /**
   * Get the error description
   */
  getDescription(): string {
    return this.description;
  }

  /**
   * Set the error description
   */
  setDescription(description: string): this {
    this.description = description;
    return this;
  }

  /**
   * Get the last request info
   */
  getLastRequestInfo(): RequestInfo {
    return this.lastRequestInfo;
  }

  /**
   * Set the last request info
   */
  setLastRequestInfo(lastRequestInfo: RequestInfo): this {
    this.lastRequestInfo = lastRequestInfo;
    return this;
  }
}
