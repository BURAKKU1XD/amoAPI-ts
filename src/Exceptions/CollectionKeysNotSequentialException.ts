import { AmoCRMApiException } from './AmoCRMApiException';

/**
 * Exception thrown when collection keys are not sequential
 */
export class CollectionKeysNotSequentialException extends AmoCRMApiException {
  constructor(
    message = 'Collection keys are not sequential',
    code = 0,
    lastRequestInfo = {},
    description = ''
  ) {
    super(message, code, lastRequestInfo, description);
    this.name = 'CollectionKeysNotSequentialException';
  }
}
