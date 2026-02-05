import { AmoCRMApiException } from './AmoCRMApiException';

/**
 * Exception thrown when too many redirects occur
 */
export class AmoCRMApiTooManyRedirectsException extends AmoCRMApiException {
  constructor(
    message = 'Too many redirects',
    code = 0,
    lastRequestInfo = {},
    description = ''
  ) {
    super(message, code, lastRequestInfo, description);
    this.name = 'AmoCRMApiTooManyRedirectsException';
  }
}
