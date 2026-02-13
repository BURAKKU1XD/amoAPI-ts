import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    LossReasonsCollection,
    AmoCRMApiException,
    LossReasonModel,
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

//Добавим новую причину отказа в аккаунт
let lossReasonsCollection = new LossReasonsCollection();
const lossReason = new LossReasonModel();
lossReason
    .setName('Причина отказа')
    .setSort(3);

lossReasonsCollection.add(lossReason);

const lossReasonService = apiClient.lossReasons();
try {
    lossReasonsCollection = await lossReasonService.add(lossReasonsCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Обновим причину отказа
let lossReasonModel = lossReasonsCollection.first();
lossReasonModel
    .setName('Новое название причины отказа');

try {
    lossReasonModel = await lossReasonService.updateOne(lossReasonModel);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Удалим причину отказа
try {
    const result = await lossReasonService.deleteOne(lossReasonModel);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Получим причины отказа
try {
    lossReasonsCollection = await lossReasonService.get();
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

console.log(lossReasonsCollection.count() + ' причин(ы) отказа в аккаунте');
