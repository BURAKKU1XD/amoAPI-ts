import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    AmoCRMApiException,
    PagesFilter,
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

const subscriptionsService = apiClient.entitySubscriptions(EntityTypes.LEADS);

let subscriptions;
try {
    const filer = new PagesFilter()
        .setLimit(3);
    subscriptions = await subscriptionsService.getByParentId(667999631, filer);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}

console.log(subscriptions.toArray());

try {
    const nextSubscriptions = await subscriptionsService.nextPage(subscriptions);
    console.log(nextSubscriptions.toArray());
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}
