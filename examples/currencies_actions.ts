/** @since Release Spring 2022 */

import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    AmoCRMApiException,
    CurrenciesFilter,
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

// Получим сервис для работы с валютами
const service = apiClient.currencies();

// Получение списка валют
let collection;
try {
    collection = await service.get();
    console.log(collection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}

// Получение первой модели из коллекции
const model = collection.first();
console.log(model.getCode());

// Получение из коллекции модели по коду
console.log(collection.getByCode('EUR'));

// Подготовим фильтр
const filter = new CurrenciesFilter();
filter.setLimit(15);
filter.setPage(2);

// Получение списка валют с фильтром
try {
    collection = await service.get(filter);
    console.log(collection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}

// Получение следующей страницы
console.log(collection.getNextPageLink());

// Получение предыдущей страницы
console.log(collection.getPrevPageLink());
