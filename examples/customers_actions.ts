import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    SegmentsCollection,
    CustomFieldsValuesCollection,
    LinksCollection,
    AmoCRMApiException,
    CustomersFilter,
    CustomerModel,
    SegmentModel,
    TextCustomFieldValuesModel,
    NullCustomFieldValueCollection,
    TextCustomFieldValueCollection,
    TextCustomFieldValueModel,
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

const customersService = apiClient.customers();
const contactsService = apiClient.contacts();

//Создадим покупателя
let customer = new CustomerModel();
customer.setName('Example');

try {
    customer = await customersService.addOne(customer);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Привяжем контакт к созданному покупателю
let contact;
try {
    contact = await contactsService.getOne(9567095);
    contact.setIsMain(false);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

const links = new LinksCollection();
links.add(contact!);
try {
    await customersService.link(customer, links);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Создадим фильтр по id покупателя
const filter = new CustomersFilter();
filter.setIds([1]);

//Получим покупателя по фильтру
let customers;
try {
    customers = await customersService.get(filter);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Обновим всех найденных покупателей
for (const customer of customers!) {
    //Получим коллекцию значений полей покупателя
    let customFields = customer.getCustomFieldsValues();

    //Получим значение поля по его ID
    let textField;
    let textFieldValues;
    if (customFields) {
        textField = customFields.getBy('fieldId', 56446);
        textFieldValues = textField?.getValues();
    } else {
        textField = new CustomFieldsValuesCollection();
    }

    //Если значения нет, то создадим новый объект поля и добавим его в коллекцию значений
    if (!textFieldValues) {
        textFieldValues = new TextCustomFieldValuesModel().setFieldId(56446);
        textField.add(textFieldValues);
    }

    //Установим значение поля
    textFieldValues.setValues(
        new TextCustomFieldValueCollection()
            .add(
                new TextCustomFieldValueModel()
                    .setValue('новое значение')
            )
    );

    //Или удалим значение поля
    textField.setValues(
        new NullCustomFieldValueCollection()
    );

    //Установим название
    customer.setName('Example customer');

    //Установим сегмент
    customer.setSegments(
        new SegmentsCollection()
            .add(
                new SegmentModel()
                    .setId(38)
            )
    );
}

//Сохраним покупателей
try {
    await customersService.update(customers!);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}
