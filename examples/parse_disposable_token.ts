import { apiClient, getToken, printError } from './bootstrap';
import {
    DisposableTokenExpiredException,
    DisposableTokenInvalidDestinationException,
    DisposableTokenVerificationFailedException,
} from 'amocrm-api-library';

const { accessToken } = getToken();

// Как пример, получим заголовки с реквеста
// И получим нужный нам X-Auth-Token
const token: string | null = process.env['HTTP_X_AUTH_TOKEN'] ?? null;

if (token === null) {
    console.log('X-Auth-Token not found');
    process.exit(1);
}

try {
    /**
     * Одноразовый токен для интеграций, для того чтобы его получить используйте
     * метод this.$authorizedAjax() в своей интеграции
     * Подробнее: @link https://www.amocrm.ru/developers/content/web_sdk/mechanics
     *
     * Данный токен должен передаваться в заголовках вместе с запросом на ваш удаленный сервер
     * X-Auth-Token: {disposable_token}
     * Время жизни токена: 30 минут
     *
     * Расшифруем пришедший токен и получим модель с информацией
     * Подробнее: @see DisposableTokenModel
     */
    const disposableTokenModel = await apiClient.getOAuthClient()
        .parseDisposableToken(token);

    console.log(disposableTokenModel.toArray());
} catch (e: any) {
    if (e instanceof DisposableTokenExpiredException) {
        // Время жизни токена истекло
        printError(e);
        process.exit(1);
    } else if (e instanceof DisposableTokenInvalidDestinationException) {
        // Не прошёл проверку на адресата токена
        printError(e);
        process.exit(1);
    } else if (e instanceof DisposableTokenVerificationFailedException) {
        // Токен не прошел проверку подписи
        printError(e);
        process.exit(1);
    }
    throw e;
}
