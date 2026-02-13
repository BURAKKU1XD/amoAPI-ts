/** @since Release Spring 2022 */

import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    MonetaryCustomFieldModel,
    AmoCRMApiException,
    LeadsFilter,
    EntityTypes,
    LeadModel,
    MonetaryCustomFieldValuesModel,
    MonetaryCustomFieldValueCollection,
    MonetaryCustomFieldValueModel,
    CustomFieldsValuesCollection,
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

// Получим сервис для работы с валютами
const currenciesService = apiClient.currencies();

// Получим список валют с 3мя валютами
const currencies = await currenciesService.get();
// Получение первой модели из коллекции
let currency = currencies.first();

// Подготовим структуру денежного поля
const monetaryCfStruct = new MonetaryCustomFieldModel();
monetaryCfStruct.setName('Денежное поле');
monetaryCfStruct.setCurrency(currency.getCode());
monetaryCfStruct.setIsApiOnly(true);

// Создадим денежное поле для сделок
let monetaryCf: MonetaryCustomFieldModel;
try {
    monetaryCf = await leadsCfService.addOne(monetaryCfStruct);
    console.log(monetaryCf);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}


// Установим валюту поля на EUR
currency = currencies.getByCode('EUR');
monetaryCf!.setCurrency(currency.getCode());

// Изменим поле
try {
    monetaryCf = await leadsCfService.updateOne(monetaryCf!);
    console.log(monetaryCf);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}


// Получим наше созданное денежное поле
try {
    const leadsCf = await leadsCfService.getOne(monetaryCf!.getId());
    console.log(leadsCf);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

// Получим сервис для работы со сделками
const leadsService = apiClient.leads();

// Получим любую 1 сделку
let lead: LeadModel;
try {
    const leads = await leadsService.get(
        new LeadsFilter().setLimit(1)
    );
    console.log(leads);

    // Получим модель сделки
    lead = leads.first();
    console.log(lead);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

// Подготовим структуру значение денежного поля
const monetaryValuesModel = new MonetaryCustomFieldValuesModel();
monetaryValuesModel.setFieldId(monetaryCf!.getId());
monetaryValuesModel.setValues(
    new MonetaryCustomFieldValueCollection().add(
        new MonetaryCustomFieldValueModel().setValue(100)
    )
);
const valuesCollection = new CustomFieldsValuesCollection().add(
    monetaryValuesModel
);

// К полученной сделке установим коллекцию значений полей сделки
lead!.setCustomFieldsValues(valuesCollection);

// Получим модель значения созданного денежного поля
lead = await leadsService.updateOne(lead!);
console.log(lead);
