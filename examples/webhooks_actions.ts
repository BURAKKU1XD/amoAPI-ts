import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    AmoCRMApiException,
    WebhookModel,
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

//Подпишемся на вебхук добавления сделки
let webhook = new WebhookModel();
webhook.setDestination('https://example.com/')
    .setSettings([
        'add_lead'
    ]);

try {
    webhook = await apiClient.webhooks().subscribe(webhook);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Отпишемся от хука
try {
    if (await apiClient.webhooks().unsubscribe(webhook)) {
        console.log("Успешно");
    } else {
        //Сюда не должны попасть никогда, так как в случае ошибки будет эксепшн
        console.log("Не успешно");
    }
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}
