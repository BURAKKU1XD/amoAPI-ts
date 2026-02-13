import { apiClient, getToken, saveToken, printError } from './bootstrap';
import { AccessTokenInterface, AmoCRMApiException } from 'amocrm-api-library';

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

const widgetsService = apiClient.widgets();
//Получим виджет
try {
    var widget = await widgetsService.getOne('amo_asterisk');
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}

widget.setSettings({
    login: 'example',
    password: 'SuchAnEasyPassword',
    script_path: 'https://example.com/amocrm_asterisk/',
    phones: {
        504141: 459, //id пользователя => добавочный номер
    },
});

//Установим виджет
try {
    widget = await widgetsService.install(widget);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}

//Отключим виджет
try {
    widget = await widgetsService.uninstall(widget);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}
