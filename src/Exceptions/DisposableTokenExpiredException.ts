import { AmoCRMApiException } from './AmoCRMApiException';

/**
 * Exception thrown when a disposable token has expired
 */
export class DisposableTokenExpiredException extends AmoCRMApiException {
  constructor(
    message = 'Disposable token expired',
    code = 0,
    lastRequestInfo = {},
    description = ''
  ) {
    super(message, code, lastRequestInfo, description);
    this.name = 'DisposableTokenExpiredException';
  }
}
