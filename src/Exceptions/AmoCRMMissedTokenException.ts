import { AmoCRMApiException } from './AmoCRMApiException';

/**
 * Exception thrown when access token is not set
 */
export class AmoCRMMissedTokenException extends AmoCRMApiException {
  constructor(
    message = 'Access token is not set',
    code = 0,
    lastRequestInfo = {},
    description = ''
  ) {
    super(message, code, lastRequestInfo, description);
    this.name = 'AmoCRMMissedTokenException';
  }
}
