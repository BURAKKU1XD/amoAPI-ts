import { apiClient, getToken, printError } from './bootstrap';
import { AmoCRMApiException } from 'amocrm-api-library';

const { accessToken } = getToken();

try {
    /**
     * В случае потери/смены субдомена аккаунта, мы можем его получить с помощью активного refresh_token.
     *
     * Получить субдомен можно сделав запрос на {api_domain}.amocrm.ru/oauth2/account/current/subdomain.
     * Получить api_domain можно распарсив JWT access_token и взять его из claim api_domain
     *
     * В данном примере получим модель с информацией о домене аккаунта по refresh_token
     * Подробнее: @see AccountDomainModel
     *
     * Запрос уходит на {api_domain}.amocrm.ru/oauth2/account/current/subdomain
     * С заголовком X-Refresh-Token: {refresh_token}
     *
     * @example curl 'https://api-a.amocrm.ru/oauth2/account/current/subdomain' -H 'X-Refresh-Token: XXX'
     */
    const accountDomainModel = await apiClient.getOAuthClient()
        .getAccountDomainByRefreshToken(accessToken);

    console.log(accountDomainModel.toArray());

    // Возьмём из полученной модели текущий subdomain аккаунта и засетим наш субдомен аккаунта в апи клиенте
    apiClient.setAccountBaseDomain(accountDomainModel.getDomain());

    console.log(apiClient.getAccountBaseDomain());
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}
