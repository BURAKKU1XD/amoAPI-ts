/** @since Release Spring 2022 */

import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    ChainedListCustomFieldModel,
    ChainedLists,
    ChainedListCustomFieldValuesModel,
    ChainedListCustomFieldValueCollection,
    CustomFieldsValuesCollection,
    AmoCRMApiException,
    LeadsFilter,
    EntityTypes,
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
let leadsCfService;
try {
    leadsCfService = apiClient.customFields(EntityTypes.LEADS);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

// Подготовим структуру поля
const chainedListCfStruct = new ChainedListCustomFieldModel();
chainedListCfStruct.setName('Вложенные списки');
chainedListCfStruct.setIsVisible(true);
chainedListCfStruct.setChainedLists(
    ChainedLists.fromArray([
        {
            catalog_id: 9929,
            parent_catalog_id: null,
            title: 'Модель',
        },
        {
            catalog_id: 9931,
            parent_catalog_id: 9929,
            title: 'Марка',
        },
    ])
);

// Создадим поле вложенных списков для сделок
let chainedListCf: ChainedListCustomFieldModel;
try {
    chainedListCf = await leadsCfService!.addOne(chainedListCfStruct);
    console.log(chainedListCf);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

// Изменим поле
try {
    chainedListCf!.setName('Авто');
    chainedListCf = await leadsCfService!.updateOne(chainedListCf!);
    console.log(chainedListCf);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

// Получим наше созданное поле
try {
    chainedListCf = await leadsCfService!.getOne(chainedListCf!.getId());
    console.log(chainedListCf);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

// Получим сервис для работы со сделками
let leadsService;
try {
    leadsService = apiClient.leads();
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

// Получим любую 1 сделку
let lead: LeadModel;
try {
    const leads = await leadsService!.get(
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

// Подготовим структуру значение поля вложенных списков
const cfValuesModel = new ChainedListCustomFieldValuesModel();
cfValuesModel.setFieldId(chainedListCf!.getId());
cfValuesModel.setValues(
    ChainedListCustomFieldValueCollection.fromArray(
        [
            // Tesla
            {
                catalog_id: 9929,
                catalog_element_id: 1600409,
            },
            // Model S
            {
                catalog_id: 9931,
                catalog_element_id: 1600411,
            },
        ]
    )
);
const valuesCollection = new CustomFieldsValuesCollection().add(cfValuesModel);

// К полученной сделке установим коллекцию значений полей сделки
lead!.setCustomFieldsValues(valuesCollection);

// Обновляем сделку
try {
    lead = await leadsService!.updateOne(lead!);
    console.log(lead);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}
