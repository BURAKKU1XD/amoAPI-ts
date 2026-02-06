import { AmoCRMApiException } from './AmoCRMApiException';

/**
 * Exception thrown when action is not available
 */
export class NotAvailableForActionException extends AmoCRMApiException {
  constructor(
    message = 'Action not available',
    code = 0,
    lastRequestInfo = {},
    description = ''
  ) {
    super(message, code, lastRequestInfo, description);
    this.name = 'NotAvailableForActionException';
  }
}
