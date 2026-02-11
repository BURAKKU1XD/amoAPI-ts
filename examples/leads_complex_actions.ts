import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    ContactsCollection,
    CustomFieldsValuesCollection,
    LeadsCollection,
    TagsCollection,
    AmoCRMApiException,
    CompanyModel,
    ContactModel,
    MultitextCustomFieldValuesModel,
    MultitextCustomFieldValueCollection,
    MultitextCustomFieldValueModel,
    LeadModel,
    TagModel,
    FormsMetadata,
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

//Представим, что у нас есть данные, полученные из сторонней системы
const externalData = [
    {
        is_new: true,
        price: 54321,
        name: 'Lead name',
        contact: {
            first_name: 'Ivan',
            last_name: 'Zinoviev',
            phone: '+79129876543',
        },
        company: {
            name: 'Qwerty LLC',
        },
        tag: 'Новый клиент',
        external_id: '0752a617-c834-4bde-b4a6-76ff0fe26871',
    },
    {
        is_new: false,
        price: 99212,
        name: 'Lead 2 name',
        contact: {
            first_name: 'Masha',
            last_name: 'Petrova',
            phone: '+79123456789',
        },
        company: {
            name: 'Asdfg LLC',
        },
        tag: 'Важный клиент',
        external_id: '4268bc22-f568-4689-84ac-7d2df9599c08',
    },
];

const leadsCollection = new LeadsCollection();

//Создадим модели и заполним ими коллекцию
for (const externalLead of externalData) {
    const lead = new LeadModel()
        .setName(externalLead.name)
        .setPrice(externalLead.price)
        .setTags(
            new TagsCollection()
                .add(
                    new TagModel()
                        .setName(externalLead.tag)
                )
        )
        .setContacts(
            new ContactsCollection()
                .add(
                    new ContactModel()
                        .setFirstName(externalLead.contact.first_name)
                        .setLastName(externalLead.contact.last_name)
                        .setCustomFieldsValues(
                            new CustomFieldsValuesCollection()
                                .add(
                                    new MultitextCustomFieldValuesModel()
                                        .setFieldCode('PHONE')
                                        .setValues(
                                            new MultitextCustomFieldValueCollection()
                                                .add(
                                                    new MultitextCustomFieldValueModel()
                                                        .setValue(externalLead.contact.phone)
                                                )
                                        )
                                )
                        )
                )
        )
        .setCompany(
            new CompanyModel()
                .setName(externalLead.company.name)
        )
        .setRequestId(externalLead.external_id);

    if (externalLead.is_new) {
        const now = new Date();
        lead.setMetadata(
            new FormsMetadata()
                .setFormId('my_best_form')
                .setFormName('Обратная связь')
                .setFormPage('https://example.com/form')
                .setFormSentAt(Math.floor(now.getTime() / 1000))
                .setReferer('https://google.com/search')
                .setIp('192.168.0.1')
        );
    }

    leadsCollection.add(lead);
}

//Создадим сделки
let addedLeadsCollection;
try {
    addedLeadsCollection = await apiClient.leads().addComplex(leadsCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

for (const addedLead of addedLeadsCollection!) {
    //Пройдемся по добавленным сделкам и выведем результат
    const leadId = addedLead.getId();
    const contactId = addedLead.getContacts()!.first().getId();
    const companyId = addedLead.getCompany()!.getId();

    const externalRequestIds = addedLead.getComplexRequestIds();
    for (const requestId of externalRequestIds) {
        const action = addedLead.isMerged() ? 'обновлены' : 'созданы';
        console.log(`Для сущности с ID ${requestId} были ${action}: сделка (${leadId}), контакт (${contactId}), компания (${companyId})`);
    }
}
