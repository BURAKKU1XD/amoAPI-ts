import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    AccountModel,
    AmoCRMApiException,
} from 'amocrm-api-library';

const { accessToken, baseDomain } = getToken();

apiClient.setAccessToken(accessToken)
    .setAccountBaseDomain(baseDomain)
    .onAccessTokenRefresh(async (accessToken: AccessTokenInterface, baseDomain: string) => {
        saveToken({
            accessToken: accessToken.getToken(),
            refreshToken: accessToken.getRefreshToken()!,
            expires: accessToken.getExpires()!,
            baseDomain,
        });
    });


//Получим свойства аккаунта со всеми доступными свойствами
try {
    const account = await apiClient.account().getCurrent(AccountModel.getAvailableWith());
    console.log(account.toArray());
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
    }
}
