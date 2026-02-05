import { AmoCRMApiException } from './AmoCRMApiException';

/**
 * Exception thrown when there's an OAuth error with amoCRM
 */
export class AmoCRMoAuthApiException extends AmoCRMApiException {
  constructor(
    message = '',
    code = 0,
    lastRequestInfo = {},
    description = ''
  ) {
    super(message, code, lastRequestInfo, description);
    this.name = 'AmoCRMoAuthApiException';
  }
}
