import { AmoCRMApiException } from './AmoCRMApiException';

/**
 * Exception thrown when collection key is a string instead of number
 */
export class StringCollectionKeyException extends AmoCRMApiException {
  constructor(
    message = 'Collection key must be a number',
    code = 0,
    lastRequestInfo = {},
    description = ''
  ) {
    super(message, code, lastRequestInfo, description);
    this.name = 'StringCollectionKeyException';
  }
}
