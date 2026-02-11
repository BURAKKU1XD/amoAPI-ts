import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    CatalogElementsCollection,
    TransactionsCollection,
    AmoCRMApiException,
    CatalogElementModel,
    TransactionModel,
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

//Добавим новую транзакцию в покупателя с id = 1 c товарами
let transactionsCollection = new TransactionsCollection();
const transaction = new TransactionModel();

const catalogElementsCollection = new CatalogElementsCollection();
catalogElementsCollection.add(
    new CatalogElementModel()
        .setCatalogId(4255)
        .setId(483287)
        .setQuantity(5)
);
transaction
    .setComment('Транзакция')
    .setPrice(123124)
    .setCatalogElements(catalogElementsCollection);

transactionsCollection.add(transaction);

//Обязательно необходимо указать ID покупателя, к которому будет добавлена транзакция
const transactionsService = apiClient.transactions();
transactionsService.setCustomerId(1);
try {
    transactionsCollection = await transactionsService.add(transactionsCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Удалим транзакцию
try {
    const result = await transactionsService.deleteOne(transaction);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Получим транзакции
try {
    transactionsCollection = await transactionsService.get();
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

console.log(transactionsCollection.count() + ' транзакции на данной странице');
