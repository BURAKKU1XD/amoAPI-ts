import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
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

const contextUserId = 123;
const apiClientWithContext = apiClient.withContextUserId(contextUserId);

//Получим свойства аккаунта и сравним юзера
try {
    const account = await apiClientWithContext.account().getCurrent();

    console.log('Текущий юзер, тот кого вы передали? - ' + (account.getCurrentUserId() === contextUserId ? 'да' : 'нет'));
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
    }
}
