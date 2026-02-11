import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    StatusesCollection,
    AmoCRMApiException,
    PipelineModel,
    StatusModel,
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

//Получим воронки
const pipelinesService = apiClient.pipelines();
let pipelinesCollection;
try {
    pipelinesCollection = await pipelinesService.get();
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}
const pipeline: PipelineModel = pipelinesCollection!.getBy('name', 'Воронка');
//Создадим сервис для работы со статусами
const statusesService = apiClient.statuses(pipeline.getId());

//Добавим статус в воронку
let statusesCollection = new StatusesCollection();
let statusModel = new StatusModel();
statusModel.setName('Новый статус')
    .setSort(200)
    .setColor('#fffd7f'); /** @see StatusModel.COLORS */
statusesCollection.add(statusModel);

try {
    statusesCollection = await statusesService.add(statusesCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Обновим статус
statusModel = statusesCollection.first();
statusModel
    .setName('Новое название статуса');

try {
    statusModel = await statusesService.updateOne(statusModel);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}


//Удалим статус
try {
    const result = await statusesService.deleteOne(statusModel);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Получим статусы воронки
try {
    statusesCollection = await statusesService.get();
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

console.log(statusesCollection.count() + ' статусов в аккаунте в воронке ' + statusesService.getEntityId());
