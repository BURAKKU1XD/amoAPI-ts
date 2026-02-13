import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    ContactsCollection,
    CustomFieldsValuesCollection,
    LeadsCollection,
    LinksCollection,
    AmoCRMApiException,
    LeadsFilter,
    CompanyModel,
    ContactModel,
    BirthdayCustomFieldValuesModel,
    DateTimeCustomFieldValuesModel,
    TextCustomFieldValuesModel,
    NullCustomFieldValueCollection,
    TextCustomFieldValueCollection,
    TextCustomFieldValueModel,
    LeadModel,
    NullTagsCollection,
    SourceModel,
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


const leadsService = apiClient.leads();

//Получим сделки и следующую страницу сделок
try {
    let leadsCollection = await leadsService.get();
    leadsCollection = await leadsService.nextPage(leadsCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Создадим сделку с заполненным бюджетом и привязанными контактами и компанией
let lead = new LeadModel();
lead.setName('Название сделки')
    .setPrice(54321)
    .setContacts(
        new ContactsCollection()
            .add(
                new ContactModel()
                    .setId(19346889)
            )
            .add(
                new ContactModel()
                    .setId(19324717)
                    .setIsMain(true)
            )
    )
    .setCompany(
        new CompanyModel()
            .setId(19187743)
    );

const tagsToAdd = [
    {
        name: 'Тег 123',
    },
    {
        name: 'Тег 456',
    },
];
lead.setTagsToAdd(tagsToAdd);

let leadsCollection = new LeadsCollection();
leadsCollection.add(lead);

try {
    leadsCollection = await leadsService.add(leadsCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Создадим сделку с заполненным полем типа текст
lead = new LeadModel();
const leadCustomFieldsValues = new CustomFieldsValuesCollection();
const textCustomFieldValueModel = new TextCustomFieldValuesModel();
textCustomFieldValueModel.setFieldId(269303);
textCustomFieldValueModel.setValues(
    new TextCustomFieldValueCollection()
        .add(new TextCustomFieldValueModel().setValue('Текст'))
);
leadCustomFieldsValues.add(textCustomFieldValueModel);
lead.setCustomFieldsValues(leadCustomFieldsValues);
lead.setName('Example');

try {
    lead = await leadsService.addOne(lead);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Получим контакт по ID, сделку и привяжем контакт к сделке
let contact: ContactModel;
try {
    contact = await apiClient.contacts().getOne(7143559);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

const links = new LinksCollection();
links.add(contact!);
try {
    await apiClient.leads().link(lead, links);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}


//Создадим фильтр по id сделки и ответственному пользователю
const filter = new LeadsFilter();
filter.setIds([1, 5170965])
    .setResponsibleUserId([504141]);

//Получим сделки по фильтру и с полем with=is_price_modified_by_robot,loss_reason,contacts
let leads: LeadsCollection;
try {
    leads = await apiClient.leads().get(filter, [LeadModel.IS_PRICE_BY_ROBOT, LeadModel.LOSS_REASON, LeadModel.CONTACTS]);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}


//Обновим все найденные сделки
for (const lead of leads!) {
    //Получим коллекцию значений полей сделки
    let customFields = lead.getCustomFieldsValues();

    //Получим значение поля по его ID
    let textFieldValueCollection: TextCustomFieldValueCollection | null = null;
    let textField: TextCustomFieldValuesModel | null = null;
    if (customFields) {
        textField = customFields.getBy('fieldId', 269303);
        if (textField) {
            textFieldValueCollection = textField.getValues();
        }
    }

    if (!textFieldValueCollection) {
        //Если полей нет
        customFields = new CustomFieldsValuesCollection();
        textField = new TextCustomFieldValuesModel().setFieldId(269303);
        textFieldValueCollection = new TextCustomFieldValueCollection();
        customFields.add(textField);
    }

    textField!.setValues(
        new TextCustomFieldValueCollection()
            .add(
                new TextCustomFieldValueModel()
                    .setValue('новое значение')
            )
    );

    //Или удалим значение поля
    //textField!.setValues(
    //    new NullCustomFieldValueCollection()
    //);

    //Ниже зададим/обновим значения для полей типа дата-время и день рождения
    for (const customFieldValues of customFields!) {
        if (
            customFieldValues instanceof DateTimeCustomFieldValuesModel
            || customFieldValues instanceof BirthdayCustomFieldValuesModel
        ) {
            const customFieldValue = customFieldValues.getValues().first();
            const value = customFieldValue.getValue();
            if (value) {
                if (customFieldValues instanceof DateTimeCustomFieldValuesModel) {
                    //Если поле дата/время, укажем завтрашний день
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    customFieldValue.setValue(tomorrow);
                } else {
                    //Если поле заполнено, добавим 100 дней
                    const newDate = new Date(value);
                    newDate.setFullYear(newDate.getFullYear() + 50);
                    customFieldValue.setValue(newDate);
                }
            }
        }
    }

    lead.setCustomFieldsValues(customFields!);

    //Установим название
    lead.setName('Example lead');
    //Установим бюджет
    lead.setPrice(12);
    //Установим нового ответственного пользователя
    lead.setResponsibleUserId(0);
    //Удалим теги
    lead.setTags(new NullTagsCollection());
}

//Сохраним сделку
try {
    await apiClient.leads().update(leads!);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}


//Получим сделку
try {
    lead = await apiClient.leads().getOne(1, [LeadModel.CONTACTS, LeadModel.CATALOG_ELEMENTS]);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Получим основной контакт сделки
const leadContacts = lead!.getContacts();
let leadMainContact;
if (leadContacts) {
    leadMainContact = leadContacts.getBy('isMain', true);
}

//Получим элемент, прикрепленный к сделке по его ID
if (lead!.getCatalogElementsLinks()) {
    const element = lead!.getCatalogElementsLinks()!.getBy('id', 425909);
    //Так как по-умолчанию в связи хранится минимум информации, то вызовем метод syncOne - чтобы засинхронить модель с amoCRM
    const syncedElement = await apiClient.catalogElements().syncOne(element);

    console.log(syncedElement);
}

// Рассмотрим кейс создания источника и создания сделки с этим источником
// ID источника на вашей стороне
const sourceExternalId = 'my-integration-super-id';
// Создадим источник
let source = new SourceModel();
source.setName('My super source')
    .setExternalId(sourceExternalId)
    .setPipelineId(4913583);

const sourcesService = apiClient.sources();

try {
    source = await sourcesService.addOne(source);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}
console.log('Added source: ');
console.log(source.toArray());
console.log('\n');


lead = new LeadModel();
lead.setName('Название сделки')
    .setPrice(54321)
    .setSourceExternalId(sourceExternalId);

try {
    lead = await leadsService.addOne(lead);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

console.log('Added lead: ');
console.log(lead.toArray());
console.log('\n');
