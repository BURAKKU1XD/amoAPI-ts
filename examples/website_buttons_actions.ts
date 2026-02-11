import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    AmoCRMApiException,
    WebsiteButtonCreateRequestModel,
    WebsiteButtonModel,
    WebsiteButtonUpdateRequestModel,
    PagesFilter,
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

// Создадим модель кнопки на сайт(CrmPlugin) и укажем воронку и доверенные домены
const buttonModel = new WebsiteButtonCreateRequestModel(
    7072170,
    [
        'amocrm.ru'
    ]
);

let source;
try {
    // Добавим данную кнопку в аккаунт как источник сделок
    source = await apiClient
        .websiteButtons()
        .createAsync(buttonModel);
    console.log(source.toArray());
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}

// Добавим еще один доверенный адрес для нашей кнопки
const updateButtonModel = new WebsiteButtonUpdateRequestModel(
    [
        'kommo.com'
    ],
    source.getSourceId()
);
try {
    const updatedSource = await apiClient
        .websiteButtons()
        .updateAsync(updateButtonModel);
    console.log(updatedSource.toArray());
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}

// Теперь добавим в нашу созданную кнопку Онлайн-чат
try {
    await apiClient
        .websiteButtons()
        .addOnlineChatAsync(source.getSourceId());
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}

// Получим 10 кнопок на сайт(CrmPlugin)
try {
    const buttons = await apiClient
        .websiteButtons()
        .get(new PagesFilter().setLimit(10));
    console.log(buttons.toArray());
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}

// Получим кнопку по id источника с кодом для вставки на сайт
try {
    const button = await apiClient
        .websiteButtons()
        .getOne(source.getSourceId(), WebsiteButtonModel.getAvailableWith());
    console.log(button.toArray());
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}
