import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    CatalogsFilter,
    CustomFieldNestedCollection,
    AmoCRMApiException,
    EntityTypes,
    CatalogModel,
    CategoryCustomFieldModel,
    NestedModel,
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

//Создадим каталог
//const catalogsCollection = new CatalogsCollection();
//const catalog = new CatalogModel();
//catalog.setName('Новый список');
//catalog.setCatalogType(EntityTypes.DEFAULT_CATALOG_TYPE_STRING);
//catalogsCollection.add(catalog);
//try {
//    await apiClient.catalogs().add(catalogsCollection);
//} catch (e: any) {
//    if (e instanceof AmoCRMApiException) {
//        printError(e);
//        process.exit(1);
//    }
//}

//Создадим каталог счетов
//const catalog = new CatalogModel();
//catalog.setName('Новый список');
//catalog.setCatalogType(EntityTypes.INVOICES_CATALOG_TYPE_STRING);
//catalog.setCanBeDeleted(false);
//
//try {
//    catalog = await apiClient.catalogs().addOne(catalog);
//} catch (e: any) {
//    if (e instanceof AmoCRMApiException) {
//        printError(e);
//        process.exit(1);
//    }
//}

//Получим каталоги по типу
let catalogsCollection;
try {
    const catalogsFilter = new CatalogsFilter();
    catalogsFilter.setType(EntityTypes.INVOICES_CATALOG_TYPE_STRING);
    catalogsCollection = await apiClient.catalogs().get(catalogsFilter);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Получим все каталоги
try {
    catalogsCollection = await apiClient.catalogs().get();
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Получим каталог по названию
let catalog = catalogsCollection!.getBy('name', 'Новый список');
//Установим сортировку и обновим каталог
if (catalog instanceof CatalogModel) {
    catalog.setSort(100);
}
try {
    await apiClient.catalogs().updateOne(catalog);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
    }
}

// обновим поле типа категория с вложенными подкатегориями
// сразу укажем вложенность через временные метки request_id|parent_request_id
let cf: CategoryCustomFieldModel = new CategoryCustomFieldModel();
cf
    .setId(604229)
    .setName('Поле Категория')
    .setSort(1)
    .setNested(
        new CustomFieldNestedCollection()
            .add(
                new NestedModel()
                    .setValue('Категория 1')
                    .setSort(1)
                    .setRequestId('category1')
            )
            .add(
                new NestedModel()
                    .setValue('ПодКатегория 1')
                    .setSort(1)
                    .setRequestId('subcategory1')
                    .setParentRequestId('category1')
            )
            .add(
                new NestedModel()
                    .setValue('ПодПодКатегория 1')
                    .setSort(1)
                    .setParentRequestId('subcategory1')
            )
    );

try {
    cf = await apiClient
        .customFields(EntityTypes.CATALOGS + ':' + catalog.getId())
        .updateOne(cf);

    console.log(JSON.stringify(cf.toArray()));
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
    }
}
