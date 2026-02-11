import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    BaseRangeFilter,
    HasOrderInterface,
    EntityTypes,
    MultitextCustomFieldValuesModel,
    MultitextCustomFieldValueCollection,
    MultitextCustomFieldValueModel,
    UnsortedModelFactory,
    ContactsCollection,
    CustomFieldsValuesCollection,
    FormsUnsortedCollection,
    SipUnsortedCollection,
    AmoCRMApiException,
    UnsortedFilter,
    UnsortedSummaryFilter,
    ContactModel,
    LeadModel,
    BaseUnsortedModel,
    FormsMetadata,
    FormUnsortedModel,
    SipMetadata,
} from 'amocrm-api-library';
import { v4 as uuidv4 } from 'uuid';

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

//Добавим звонок в неразобранное
let sipUnsortedCollection = new SipUnsortedCollection();
const sipUnsorted = UnsortedModelFactory.createForCategory(BaseUnsortedModel.CATEGORY_CODE_SIP);
const sipMetadata = new SipMetadata();
const now = new Date();
sipMetadata
    .setServiceCode('my_best_telephony')
    .setLink('https://example.com/example.mp3')
    .setDuration(135)
    .setCalledAt(Math.floor(new Date(2019, 9, 4, now.getHours(), now.getMinutes(), now.getSeconds()).getTime() / 1000))
    .setPhone('135')
    .setFrom('+79123456789')
    .setUniq(uuidv4())
    .setIsCallEventNeeded(true); // нужно ли примечание о звонке

let unsortedLead = new LeadModel();
unsortedLead.setName('Сделка')
    .setPrice(500000);

let unsortedContactsCollection = new ContactsCollection();
let unsortedContact = new ContactModel();
unsortedContact.setName('Контакт');
unsortedContactsCollection.add(unsortedContact);

sipUnsorted
    .setSourceName('Название источника')
    .setSourceUid('my_unique_uid')
    .setCreatedAt(Math.floor(Date.now() / 1000))
    .setMetadata(sipMetadata)
    .setLead(unsortedLead)
    .setPipelineId(3166396)
    .setContacts(unsortedContactsCollection);

sipUnsortedCollection.add(sipUnsorted);

const unsortedService = apiClient.unsorted();
try {
    sipUnsortedCollection = await unsortedService.add(sipUnsortedCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Добавим в неразобранное форму
let formsUnsortedCollection = new FormsUnsortedCollection();
const formUnsorted = new FormUnsortedModel();
const formMetadata = new FormsMetadata();
formMetadata
    .setFormId('my_best_form')
    .setFormName('Обратная связь')
    .setFormPage('https://example.com/form')
    .setFormSentAt(Math.floor(new Date(2019, 9, 4, now.getHours(), now.getMinutes(), now.getSeconds()).getTime() / 1000))
    .setReferer('https://google.com/search')
    .setIp('192.168.0.1');

unsortedLead = new LeadModel();
unsortedLead.setName('Сделка')
    .setPrice(500000);

unsortedContactsCollection = new ContactsCollection();
unsortedContact = new ContactModel();
unsortedContact.setName('Контакт');
const contactCustomFields = new CustomFieldsValuesCollection();
const phoneFieldValueModel = new MultitextCustomFieldValuesModel();
phoneFieldValueModel.setFieldCode('PHONE');
phoneFieldValueModel.setValues(
    new MultitextCustomFieldValueCollection()
        .add(new MultitextCustomFieldValueModel().setValue('+79123456789'))
);
unsortedContact.setCustomFieldsValues(contactCustomFields.add(phoneFieldValueModel));
unsortedContactsCollection.add(unsortedContact);

formUnsorted
    .setSourceName('Название источника')
    .setSourceUid('my_unique_uid')
    .setCreatedAt(Math.floor(Date.now() / 1000))
    .setMetadata(formMetadata)
    .setLead(unsortedLead)
    .setPipelineId(3166396)
    .setContacts(unsortedContactsCollection);

formsUnsortedCollection.add(formUnsorted);

try {
    formsUnsortedCollection = await unsortedService.add(formsUnsortedCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

let unsortedCollection;
try {
    const unsortedFiler = new UnsortedFilter();
    unsortedFiler
        .setCategory([BaseUnsortedModel.CATEGORY_CODE_FORMS, BaseUnsortedModel.CATEGORY_CODE_SIP])
        .setOrder('created_at', HasOrderInterface.SORT_ASC);
    unsortedCollection = await unsortedService.get(unsortedFiler);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//первое неразобранное примем
const unsortedModel = unsortedCollection!.first();
let acceptResult;
try {
    acceptResult = await unsortedService.accept(unsortedModel);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//получим ID сделки, которая была принята
const leadId = acceptResult!.getLeads().first().getId();

//последнее отклоним
const unsortedModelLast = unsortedCollection!.last();
try {
    const declineResult = await unsortedService.decline(unsortedModelLast);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Получим статистику по неразобранному
try {
    const unsortedSummaryFilter = new UnsortedSummaryFilter();
    unsortedSummaryFilter
        .setCreatedAt(new BaseRangeFilter()
            .setFrom(Math.floor(Date.now() / 1000) - 10 * 24 * 60 * 60)
            .setTo(Math.floor(Date.now() / 1000)));
    const unsortedSummary = await unsortedService.summary(unsortedSummaryFilter);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Привяжем неразобранное к сделке/контакту/покупателю
//Доступны только неразобранные типа chat/mail
try {
    const unsortedFiler = new UnsortedFilter();
    unsortedFiler
        .setCategory(BaseUnsortedModel.CATEGORY_CODE_CHATS);
    const unsortedChatCollection = await unsortedService.get(unsortedFiler);

    const body = {
        link: {
            entity_type: EntityTypes.LEADS,
            entity_id: 3921175,
        },
        user_id: 0,
    };
    const result = await unsortedService.link(unsortedChatCollection.first(), body);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}
