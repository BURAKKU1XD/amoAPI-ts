import { AmoCRMApiException } from './AmoCRMApiException';

/**
 * Exception thrown when disposable token has invalid destination
 */
export class DisposableTokenInvalidDestinationException extends AmoCRMApiException {
  constructor(
    message = 'Disposable token invalid destination',
    code = 0,
    lastRequestInfo = {},
    description = ''
  ) {
    super(message, code, lastRequestInfo, description);
    this.name = 'DisposableTokenInvalidDestinationException';
  }
}
