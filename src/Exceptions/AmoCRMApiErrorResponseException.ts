import { AmoCRMApiException } from './AmoCRMApiException';

/**
 * Exception thrown for API error responses
 */
export class AmoCRMApiErrorResponseException extends AmoCRMApiException {
  constructor(
    message = 'API Error Response',
    code = 0,
    lastRequestInfo = {},
    description = ''
  ) {
    super(message, code, lastRequestInfo, description);
    this.name = 'AmoCRMApiErrorResponseException';
  }
}
