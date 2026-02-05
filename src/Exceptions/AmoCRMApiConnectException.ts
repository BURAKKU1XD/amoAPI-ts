import { AmoCRMApiException } from './AmoCRMApiException';

/**
 * Exception thrown for connection errors
 */
export class AmoCRMApiConnectException extends AmoCRMApiException {
  constructor(
    message = 'Connection error',
    code = 0,
    lastRequestInfo = {},
    description = ''
  ) {
    super(message, code, lastRequestInfo, description);
    this.name = 'AmoCRMApiConnectException';
  }
}
