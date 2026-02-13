import { AmoCRMApiClient, LongLivedAccessToken, AmoCRMApiException } from 'amocrm-api-library';
import { printError } from './error_printer';

const accessToken = 'XXX';
const accountUrl = 'example.amocrm.ru';

const apiClient = new AmoCRMApiClient();
let longLivedAccessToken: LongLivedAccessToken;
try {
    longLivedAccessToken = new LongLivedAccessToken(accessToken);
} catch (e: any) {
    printError(e);
    process.exit(1);
}

apiClient.setAccessToken(longLivedAccessToken)
    .setAccountBaseDomain(accountUrl);

//Получим информацию об аккаунте
(async () => {
    try {
        const account = await apiClient.account().getCurrent();
        console.log(account.getName());
    } catch (e: any) {
        if (e instanceof AmoCRMApiException) {
            console.log(e.getTraceAsString());
            printError(e);
        }
        process.exit(1);
    }
})();
