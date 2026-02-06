import { AmoCRMApiException } from './AmoCRMApiException';

/**
 * Exception thrown for HTTP client errors
 */
export class AmoCRMApiHttpClientException extends AmoCRMApiException {
  constructor(
    message = '',
    code = 0,
    lastRequestInfo = {},
    description = ''
  ) {
    super(message, code, lastRequestInfo, description);
    this.name = 'AmoCRMApiHttpClientException';
  }
}
