import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    AmoCRMApiException,
    ShortLinkModel,
    EntityTypes,
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

//Сервис коротких ссылок
const shortLinksService = apiClient.shortLinks();

//Создадим ссылку
let shortLink = new ShortLinkModel();
shortLink
    .setUrl('https://example.com')
    .setEntityType(EntityTypes.CONTACTS)
    .setEntityId(11070881);

try {
    shortLink = await shortLinksService.addOne(shortLink);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}

console.log(shortLink.toArray());
