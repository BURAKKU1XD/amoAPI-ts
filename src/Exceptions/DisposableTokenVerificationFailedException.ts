import { AmoCRMApiException } from './AmoCRMApiException';

/**
 * Exception thrown when disposable token verification fails
 */
export class DisposableTokenVerificationFailedException extends AmoCRMApiException {
  constructor(
    message = 'Disposable token verification failed',
    code = 0,
    lastRequestInfo = {},
    description = ''
  ) {
    super(message, code, lastRequestInfo, description);
    this.name = 'DisposableTokenVerificationFailedException';
  }
}
