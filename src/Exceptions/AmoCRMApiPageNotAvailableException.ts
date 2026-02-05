import { AmoCRMApiException } from './AmoCRMApiException';

/**
 * Exception thrown when requested page is not available
 */
export class AmoCRMApiPageNotAvailableException extends AmoCRMApiException {
  constructor(
    message = 'Page not available',
    code = 0,
    lastRequestInfo = {},
    description = ''
  ) {
    super(message, code, lastRequestInfo, description);
    this.name = 'AmoCRMApiPageNotAvailableException';
  }
}
