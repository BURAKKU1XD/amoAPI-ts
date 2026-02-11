import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    ChatLinksCollection,
    ChatLinkModel,
    AmoCRMApiException,
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

// Массив с ID контактов и uuid идентификаторов чатов
const data = [
    {
        chat_id: 'd7a2842c-d926-43bc-a090-21ab410b8acb',
        contact_id: 18738957
    },
    {
        chat_id: '61aca544-27dd-4601-9f9e-67e3cbbba2e0',
        contact_id: 18742731
    }
];

const chatLinksCollection = new ChatLinksCollection();

//Создадим модели и заполним ими коллекцию
for (const linksChat of data) {
    const linkChat = new ChatLinkModel()
        .setContactId(linksChat.contact_id)
        .setChatId(linksChat.chat_id);

    chatLinksCollection.add(linkChat);
}

// Привязываем чат к контакту
let linksChatCollection;
try {
    linksChatCollection = await apiClient.contacts().linkChats(chatLinksCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

for (const linkChat of linksChatCollection!) {
    const contactId = linkChat.getContactId();
    const chatId = linkChat.getChatId();

    console.log(`Для сущности с ID ${contactId} был привязан чат ${chatId}`);
}
