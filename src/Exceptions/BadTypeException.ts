import { AmoCRMApiException } from './AmoCRMApiException';

/**
 * Exception thrown for bad type errors
 */
export class BadTypeException extends AmoCRMApiException {
  constructor(
    message = 'Bad type',
    code = 0,
    lastRequestInfo = {},
    description = ''
  ) {
    super(message, code, lastRequestInfo, description);
    this.name = 'BadTypeException';
  }
}
