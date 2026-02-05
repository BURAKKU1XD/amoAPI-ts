import { AmoCRMApiException } from './AmoCRMApiException';

/**
 * Exception thrown when collection and response keys are not identical
 */
export class CollectionAndResponseKeysNotIdenticalException extends AmoCRMApiException {
  constructor(
    message = 'Collection and response keys are not identical',
    code = 0,
    lastRequestInfo = {},
    description = ''
  ) {
    super(message, code, lastRequestInfo, description);
    this.name = 'CollectionAndResponseKeysNotIdenticalException';
  }
}
