import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    CustomFieldEnumsCollection,
    EntityTypes,
    CustomFieldsCollection,
    AmoCRMApiException,
    CustomFieldsFilter,
    CheckboxCustomFieldModel,
    CustomFieldModel,
    EnumModel,
    SelectCustomFieldModel,
    TextCustomFieldModel,
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

//Сервис кастом полей для сделок
const customFieldsService = apiClient.customFields(EntityTypes.LEADS);

//Сервис кастом полей для сегментов
//const customFieldsService = apiClient.customFields(EntityTypes.CUSTOMERS_SEGMENTS);

//Сервис кастом полей для каталога (id каталога указывается через :)
//const customFieldsService = apiClient.customFields(EntityTypes.CATALOGS + ':' + 4255);

//Получим поля
let result;
try {
    result = await customFieldsService.get();
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Получим поля по типу
try {
    const filter = new CustomFieldsFilter()
        .setTypes([CustomFieldModel.TYPE_TEXT, CustomFieldModel.TYPE_URL]); // или ['text', 'url']
    result = await customFieldsService.get(filter);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Создадим модель поля и освежим его
let customFieldModel = new CustomFieldModel();
customFieldModel.setId(269303);

try {
    customFieldModel = await customFieldsService.syncOne(customFieldModel);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}


//Создадим несколько полей
let customFieldsCollection = new CustomFieldsCollection();
let cf: any = new TextCustomFieldModel();
cf
    .setName('Поле Текст')
    .setSort(10);

customFieldsCollection.add(cf);

cf = new CheckboxCustomFieldModel();
cf
    .setName('Поле Чекбокс')
    .setSort(20)
    .setCode('MYSUPERCHECKBOX100');

customFieldsCollection.add(cf);

cf = new SelectCustomFieldModel();
cf
    .setName('Поле Список')
    .setSort(30)
    .setCode('MYSUPERLISTCF100')
    .setEnums(
        new CustomFieldEnumsCollection()
            .add(
                new EnumModel()
                    .setValue('Значение 1')
                    .setSort(10)
            )
            .add(
                new EnumModel()
                    .setValue('Значение 2')
                    .setSort(20)
            )
            .add(
                new EnumModel()
                    .setValue('Значение 3')
                    .setSort(30)
            )
    );

customFieldsCollection.add(cf);

try {
    //Добавим поля в аккаунт
    customFieldsCollection = await customFieldsService.add(customFieldsCollection);

    //Получим объект поля и удалим его
    const fieldToDelete = customFieldsCollection.getBy('code', 'MYSUPERCHECKBOX100');
    if (fieldToDelete) {
        await customFieldsService.deleteOne(fieldToDelete);
    }

    //Получим объект группы и обновим, добавим enum и сделаем поле доступным для редактирования только через API
    let fieldToUpdate = customFieldsCollection.getBy('code', 'MYSUPERLISTCF100');
    const enums = fieldToUpdate.getEnums();
    if (enums) {
        enums.add(
            new EnumModel()
                .setValue('Значение 4')
                .setSort(40)
        );
    }
    fieldToUpdate.setEnums(enums);
    fieldToUpdate.setIsApiOnly(true);
    fieldToUpdate = await customFieldsService.updateOne(fieldToUpdate);
    console.log(fieldToUpdate.toArray());
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}
