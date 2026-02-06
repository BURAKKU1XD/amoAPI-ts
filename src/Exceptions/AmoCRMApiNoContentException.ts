import { AmoCRMApiException } from './AmoCRMApiException';

/**
 * Exception thrown for 204 No Content responses
 */
export class AmoCRMApiNoContentException extends AmoCRMApiException {
  constructor(
    message = 'No Content',
    code = 204,
    lastRequestInfo = {},
    description = ''
  ) {
    super(message, code, lastRequestInfo, description);
    this.name = 'AmoCRMApiNoContentException';
  }
}
