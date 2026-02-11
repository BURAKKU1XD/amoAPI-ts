/** @since Release Spring 2022 */

import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    BillStatusEnum,
    CustomFieldEnumsCollection,
    CustomFieldsValuesCollection,
    InvoicesCustomFields,
    EntityTypes,
    AccountModel,
    CatalogElementModel,
    CustomerModel,
    EnumModel,
    SelectCustomFieldModel,
    SelectCustomFieldValuesModel,
    SelectCustomFieldValueCollection,
    SelectCustomFieldValueModel,
    CatalogsFilter,
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

/**
 * Сборка поля типа "список" {@see CustomFieldModel.TYPE_SELECT}
 */
function makeSelectField(): SelectCustomFieldModel {
    const model = new SelectCustomFieldModel();
    model.setName('Test select field with enums codes');

    const enums = new CustomFieldEnumsCollection();

    const first = new EnumModel();
    first.setSort(1);
    first.setCode('first');
    first.setValue('Первый вариант');
    enums.add(first);

    const second = new EnumModel();
    second.setSort(2);
    second.setCode('second');
    second.setValue('Второй вариант');
    enums.add(second);

    model.setEnums(enums);

    return model;
}

// покупатели
const customers = apiClient.customers();
// включаем покупателей
await customers.setMode(AccountModel.SEGMENTS, true);
// каталог "счета/покупки"
const invoicesCatalog = (await apiClient.catalogs().get(
    new CatalogsFilter().setType(EntityTypes.INVOICES_CATALOG_TYPE_STRING)
)).first();

// создание поле select для покупателей с указанием enums - enum-code
const customersSelectField = await apiClient.customFields(EntityTypes.CUSTOMERS).addOne(makeSelectField());
console.log(customersSelectField);

// получение полей
const customersCustomFields = await apiClient.customFields(EntityTypes.CUSTOMERS).get();
console.log(customersCustomFields);

// создание покупателя
const customerForCreate = new CustomerModel();
customerForCreate.setName('Test customer');
const customerCustomFieldsValues = new CustomFieldsValuesCollection();
// указываем "Второй вариант" по коду энама
const variant = new SelectCustomFieldValuesModel();
variant
    .setFieldId(customersSelectField.getId())
    .setValues(new SelectCustomFieldValueCollection().add(
        new SelectCustomFieldValueModel().setEnumCode('second')
    ));
customerCustomFieldsValues.add(variant);
customerForCreate.setCustomFieldsValues(customerCustomFieldsValues);
const createdCustomer = await apiClient.customers().addOne(customerForCreate);
console.log(createdCustomer);


// создаем счет в статусе "Создан"
const invoicesCustomFields = await apiClient.customFields(
    EntityTypes.CATALOGS + ':' + invoicesCatalog.getId()
).get();
// получим поле "Статус" по его коду
const statusField = invoicesCustomFields.getBy('code', InvoicesCustomFields.STATUS);
console.log(statusField);

const invoiceModelForCreate = new CatalogElementModel();
invoiceModelForCreate.setName('Test invoice');
invoiceModelForCreate.setCatalogId(invoicesCatalog.getId());
const invoicesCustomFieldsValues = new CustomFieldsValuesCollection();
// Указываем статус "Создан"
const statusFieldValue = new SelectCustomFieldValuesModel();
statusFieldValue
    .setFieldCode(InvoicesCustomFields.STATUS)
    .setValues(new SelectCustomFieldValueCollection().add(
        new SelectCustomFieldValueModel().setEnumCode(BillStatusEnum.CREATED)
    ));
invoicesCustomFieldsValues.add(statusFieldValue);
invoiceModelForCreate.setCustomFieldsValues(invoicesCustomFieldsValues);
// создаем счет
let createdInvoice = await apiClient.catalogElements(invoicesCatalog.getId()).addOne(invoiceModelForCreate);
console.log(createdInvoice);

// еще раз получим наш созданный счет
createdInvoice = await apiClient.catalogElements(invoicesCatalog.getId()).getOne(createdInvoice.getId());
console.log(createdInvoice);

const invoicesCustomFieldsValues2 = new CustomFieldsValuesCollection();
// Указываем статус "Оплачен"
const statusFieldValue2 = new SelectCustomFieldValuesModel();
statusFieldValue2
    .setFieldCode(InvoicesCustomFields.STATUS)
    .setValues(new SelectCustomFieldValueCollection().add(
        new SelectCustomFieldValueModel().setEnumCode(BillStatusEnum.PAID)
    ));
invoicesCustomFieldsValues2.add(statusFieldValue2);
createdInvoice.setCustomFieldsValues(invoicesCustomFieldsValues2);
// обновляем счет на статус "Оплачен"
const updatedInvoice = await apiClient.catalogElements(invoicesCatalog.getId()).updateOne(createdInvoice);
console.log(updatedInvoice);
