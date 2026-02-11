import { AmoCRMApiException, AmoCRMApiErrorResponseException } from 'amocrm-api-library';

export function printError(e: AmoCRMApiException): void {
    const errorTitle = e.getTitle();
    const code = e.getErrorCode();
    const debugInfo = JSON.stringify(e.getLastRequestInfo(), null, 2);

    let error = `Error: ${errorTitle}\nCode: ${code}\nDebug: ${debugInfo}`;

    if (e instanceof AmoCRMApiErrorResponseException) {
        const validationErrors = JSON.stringify(e.getValidationErrors(), null, 2);
        error += '\n' + 'Validation-Errors: ' + validationErrors + '\n';
    }

    console.log(error);
}
