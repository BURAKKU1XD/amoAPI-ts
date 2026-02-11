import { apiClient, getToken, saveToken, printError } from './bootstrap';
import { AccessTokenInterface, AmoCRMApiException } from 'amocrm-api-library';

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

//Сделаем запрос с апи ключом, чтобы получить код авторизации
//Код авторизации отправляется в виде вебхука на указанный redirect_uri c GET-параметром from_exchange=1
const login = 'example@example.com';
const apiKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
try {
    await apiClient.getOAuthClient().exchangeApiKey(login, apiKey);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}
