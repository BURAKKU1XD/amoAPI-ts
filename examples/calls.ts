import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    CallModel,
    CallInterface,
    AmoCRMApiException,
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

//Добавим входящий звонок
let call = new CallModel();
call
    .setPhone('+7912312321') // кто звонил
    .setCallStatus(CallInterface.CALL_STATUS_SUCCESS_CONVERSATION)
    .setCallResult('Разговор состоялся')
    .setDuration(148)
    .setUniq(uuidv4())
    .setSource('integration name')
    .setDirection(CallInterface.CALL_DIRECTION_IN)
    .setCallResponsible('+79161234567') // кому звонили, можно id пользователя, или строку
    .setLink('https://example.test/test.mp3');

try {
    call = await apiClient.calls().addOne(call);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}
