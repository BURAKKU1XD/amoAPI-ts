import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    ContactsCollection,
    LinksCollection,
    AmoCRMApiException,
    ContactsFilter,
    ContactModel,
    MultitextCustomFieldValuesModel,
    MultitextCustomFieldValueCollection,
    MultitextCustomFieldValueModel,
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

//Создадим контакт
let contact = new ContactModel();
contact.setName('Example');

let contactModel: ContactModel;
try {
    contactModel = await apiClient.contacts().addOne(contact);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

let contactsCollection = new ContactsCollection();
//Создадим несколько контактов
for (const name of ['Example 1', 'Example 2']) {
    //Создадим контакт
    contact = new ContactModel();
    contact.setName(name);

    contactsCollection.add(contact);
}
try {
    contactsCollection = await apiClient.contacts().add(contactsCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}


//Получим сделку по ID, сделку и привяжем контакт к сделке
let lead;
try {
    lead = await apiClient.leads().getOne(3916883);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

const links = new LinksCollection();
links.add(lead!);
try {
    await apiClient.contacts().link(contactModel!, links);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Получим один контакт и добавим ему значение поля телефон
try {
    contact = await apiClient.contacts().getOne(3);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

// Работает только, если уже существует что-то внутри getCustomFieldsValues().
// В противном случае возвращает null и следует использовать setCustomFieldsValues.
// Получим коллекцию значений полей контакта
const customFields = contact.getCustomFieldsValues();
//Получим значение поля по его коду
let phoneField = customFields.getBy('fieldCode', 'PHONE');

//Если значения нет, то создадим новый объект поля и добавим его в коллекцию значений
if (!phoneField) {
    phoneField = new MultitextCustomFieldValuesModel().setFieldCode('PHONE');
    customFields.add(phoneField);
}

//Установим значение поля
phoneField.setValues(
    new MultitextCustomFieldValueCollection()
        .add(
            new MultitextCustomFieldValueModel()
                .setEnum('WORKDD')
                .setValue('+79123')
        )
);

//Установим название
contact.setName('Example contact');

//Сохраним контакт
try {
    await apiClient.contacts().updateOne(contact);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}


//Создадим фильтр с id контакта (работает только в аккаунтах, подключенных к функционалу фильтрации)
const filter = new ContactsFilter();
filter.setIds([3]);

//Получим сделки по фильтру
let contacts: ContactsCollection;
try {
    contacts = await apiClient.contacts().get(filter);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Обновим все найденные контакты
for (const contact of contacts!) {
    //Получим коллекцию значений полей контакта
    const customFields = contact.getCustomFieldsValues();
    //Получим значение поля по его ID
    let emailField = customFields.getBy('fieldCode', 'EMAIL');
    //Если значения нет, то создадим новый объект поля и добавим его в коллекцию значений
    if (!emailField) {
        emailField = new MultitextCustomFieldValuesModel().setFieldCode('EMAIL');
        customFields.add(emailField);
    }

    //Установим значение поля
    emailField.setValues(
        new MultitextCustomFieldValueCollection()
            .add(
                new MultitextCustomFieldValueModel()
                    .setEnum('WORK')
                    .setValue('example@test.com')
            )
    );

    //Установим название
    contact.setName('Example contact');
}

//Сохраним контакты
try {
    await apiClient.contacts().update(contacts!);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}
