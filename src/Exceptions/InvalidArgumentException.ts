import { AmoCRMApiException } from './AmoCRMApiException';

/**
 * Exception thrown for invalid arguments
 */
export class InvalidArgumentException extends AmoCRMApiException {
  constructor(
    message = 'Invalid argument',
    code = 0,
    lastRequestInfo = {},
    description = ''
  ) {
    super(message, code, lastRequestInfo, description);
    this.name = 'InvalidArgumentException';
  }
}
