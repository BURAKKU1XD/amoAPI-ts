import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    CatalogElementsCollection,
    LinksCollection,
    AmoCRMApiException,
    AmoCRMoAuthApiException,
    CatalogElementsFilter,
    CatalogElementModel,
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

//Получим все каталоги
let catalogsCollection;
try {
    catalogsCollection = await apiClient.catalogs().get();
} catch (e: any) {
    if (e instanceof AmoCRMApiException || e instanceof AmoCRMoAuthApiException) {
        console.log('Error happen - ' + e.message + ' ' + e.getErrorCode() + e.getTitle());
        process.exit(1);
    }
}

//Получим каталог по названию
const catalog = catalogsCollection!.getBy('name', 'Товары');

//Добавим элемент в каталог (Список)
let catalogElementsCollection = new CatalogElementsCollection();
const catalogElement = new CatalogElementModel();
catalogElement.setName('Новый товар');
catalogElementsCollection.add(catalogElement);
const catalogElementsService = apiClient.catalogElements(catalog.getId());
try {
    await catalogElementsService.add(catalogElementsCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}


//Получим элементы из нужного нам каталога, где в названии или полях есть слово кросовки
catalogElementsCollection = new CatalogElementsCollection();
const catalogElementsService2 = apiClient.catalogElements(catalog.getId());
const catalogElementsFilter = new CatalogElementsFilter();
catalogElementsFilter.setQuery('Кросовки');
try {
    catalogElementsCollection = await catalogElementsService2.get(catalogElementsFilter);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

const nikeElement = catalogElementsCollection.getBy('name', 'Кросовки Nike');
if (nikeElement) {
    //Установим кол-во, так как эта модель будет привязана, данное свойство используется только при привязке к сущности
    nikeElement.setQuantity(10.22);
    //Получим сделку по ID
    let lead;
    try {
        lead = await apiClient.leads().getOne(7397517);
    } catch (e: any) {
        if (e instanceof AmoCRMApiException) {
            printError(e);
            process.exit(1);
        }
    }

    //Привяжем к сделке наш элемент
    const links = new LinksCollection();
    links.add(nikeElement);
    try {
        await apiClient.leads().link(lead!, links);
    } catch (e: any) {
        if (e instanceof AmoCRMApiException) {
            printError(e);
            process.exit(1);
        }
    }
}
