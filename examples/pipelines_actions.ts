import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    PipelinesCollection,
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

//Добавим новую главную воронку со статусами
//Сортировка для главной воронки проставится автоматически
let pipelinesCollection = new PipelinesCollection();
const pipeline = new PipelineModel();
const statusesCollection = new StatusesCollection();
statusesCollection.add(
    new StatusModel()
        .setName('Новый статус')
        .setColor('#fffd7f') /** @see StatusModel.COLORS */
).add(
    new StatusModel()
        .setName('Новый статус 2')
        .setColor('#ccc8f9') /** @see StatusModel.COLORS */
);

pipeline
    .setName('Новая главная воронка')
    .setIsMain(true)
    .setStatuses(statusesCollection);

pipelinesCollection.add(pipeline);

const pipelinesService = apiClient.pipelines();
try {
    pipelinesCollection = await pipelinesService.add(pipelinesCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Обновим воронку
let pipelineModel: PipelineModel = pipelinesCollection.first();
pipelineModel
    .setName('Новое название воронки')
    .setIsMain(false);

try {
    pipelineModel = await pipelinesService.updateOne(pipelineModel);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Удалим воронку
try {
    const result = await pipelinesService.deleteOne(pipelineModel);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Получим воронки
try {
    pipelinesCollection = await pipelinesService.get();
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

console.log(pipelinesCollection.count() + ' воронок в аккаунте');
