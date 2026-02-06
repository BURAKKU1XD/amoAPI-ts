import { AmoCRMApiHttpClientException } from './AmoCRMApiHttpClientException';

/**
 * Exception thrown when receiving a 429 (Too Many Requests) response
 */
export class AmoCRMApiTooManyRequestsException extends AmoCRMApiHttpClientException {
  constructor(
    message = 'Too Many Requests',
    code = 429,
    lastRequestInfo = {},
    description = ''
  ) {
    super(message, code, lastRequestInfo, description);
    this.name = 'AmoCRMApiTooManyRequestsException';
  }
}
