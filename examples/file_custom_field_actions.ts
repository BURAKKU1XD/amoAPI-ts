/** @since Release Spring 2022 */

import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    CustomFieldsCollection,
    CustomFieldsValuesCollection,
    AmoCRMApiException,
    LeadsFilter,
    EntityTypes,
    CustomFieldModel,
    FileCustomFieldModel,
    FileCustomFieldValuesModel,
    FileCustomFieldValueCollection,
    FileCustomFieldValueModel,
    LeadModel,
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

// Сервис кастомных полей для сделок
const leadsCfService = apiClient.customFields(EntityTypes.LEADS);

// Получение полей сделки
const leadsCfCollection: CustomFieldsCollection = await leadsCfService.get();

let fileCfModel: FileCustomFieldModel | null = null;
if (leadsCfCollection !== null) {
    // Получение поля типа "Файл"
    fileCfModel = leadsCfCollection.getBy('type', CustomFieldModel.TYPE_FILE);
}

if (fileCfModel === null) {
    // Создание поля
    fileCfModel = new FileCustomFieldModel();
    fileCfModel.setName('Поле типа "Файл"');
    fileCfModel.setIsVisible(true);

    fileCfModel = await leadsCfService.addOne(fileCfModel);
}

// Изменение поля
fileCfModel.setName('Поле типа "Файл" CHANGED ');
fileCfModel = await leadsCfService.updateOne(fileCfModel);

// Получим сервис для работы со сделками
const leadsService = apiClient.leads();

const leads = await leadsService.get(new LeadsFilter().setLimit(1));

// Получим модель сделки
let lead: LeadModel = leads.first();
if (lead === null) {
    // Если нет сделок - создадим
    lead = await leadsService.addOne(
        new LeadModel().setName('Сделка для тестирование поля "Файл"')
    );
}

// Подготовим структуру значение поля типа "Файл"
const cfValuesModel = new FileCustomFieldValuesModel();
cfValuesModel.setFieldId(fileCfModel.getId());
// Готовим коллекцию значений
const cfValueCollection = new FileCustomFieldValueCollection();
// Готовим модель значения
const cfValueModel = new FileCustomFieldValueModel();
// в результате загрузки файла будет возвращена информация по файлу
// нас интересует свойство file_uuid {@see FileCustomFieldValueModel}
// @link todo тут ссылка на документацию по загрузке файлов
cfValueModel.setFileUuid('832637d2-54da-4e0b-b1cb-05b70566e3cc');
// Добавляем значение в коллекцию значений
cfValueCollection.add(cfValueModel);
// Устанавливаем коллекцию в модель
cfValuesModel.setValues(cfValueCollection);
const valuesCollection = new CustomFieldsValuesCollection().add(cfValuesModel);
// К полученной сделке установим коллекцию значений полей сделки
lead.setCustomFieldsValues(valuesCollection);

// Обновляем сделку
try {
    lead = await leadsService.updateOne(lead);
    console.log(lead);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

// Удаление поля
//const isDeleted = await leadsCfService.deleteOne(fileCfModel);
//console.log(isDeleted);
