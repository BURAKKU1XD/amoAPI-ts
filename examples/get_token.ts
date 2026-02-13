import { apiClient, saveToken, getToken, printError } from './bootstrap';

/**
 * Ловим обратный код
 *
 * В PHP версии это был веб-скрипт с OAuth flow через браузер.
 * В Node.js версии это простой скрипт для обмена authorization code на access token.
 *
 * Передайте code и referer (baseDomain) как аргументы командной строки:
 *   ts-node get_token.ts <code> [referer]
 */

const code = process.argv[2];
const referer = process.argv[3];

if (!code) {
    console.error('Usage: ts-node get_token.ts <code> [referer]');
    process.exit(1);
}

if (referer) {
    apiClient.setAccountBaseDomain(referer);
}

(async () => {
    try {
        const accessToken = await apiClient.getOAuthClient().getAccessTokenByCode(code);

        if (!accessToken.hasExpired()) {
            saveToken({
                accessToken: accessToken.getToken(),
                refreshToken: accessToken.getRefreshToken()!,
                expires: accessToken.getExpires()!,
                baseDomain: apiClient.getAccountBaseDomain(),
            });
        }

        const ownerDetails = await apiClient.getOAuthClient().getResourceOwner(accessToken);

        console.log(`Hello, ${ownerDetails.getName()}!`);
    } catch (e: any) {
        console.error(String(e));
        process.exit(1);
    }
})();
