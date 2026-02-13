import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    AmoCRMApiException,
    RoleModel,
    RightModel,
    EntityTypes,
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

//Сервис ролей
const rolesService = apiClient.roles();

//Создадим роль
let roleModel = new RoleModel();
roleModel
    .setName('Новая роль')
    .setRights(
        new RightModel()
            .setLeadsRights({
                [RightModel.ACTION_ADD]: RightModel.RIGHTS_DENIED,
                [RightModel.ACTION_VIEW]: RightModel.RIGHTS_ONLY_RESPONSIBLE,
                [RightModel.ACTION_DELETE]: RightModel.RIGHTS_FULL,
                [RightModel.ACTION_EXPORT]: RightModel.RIGHTS_ONLY_RESPONSIBLE,
                [RightModel.ACTION_EDIT]: RightModel.RIGHTS_FULL,
            })
            .setCompaniesRights({
                [RightModel.ACTION_ADD]: RightModel.RIGHTS_DENIED,
                [RightModel.ACTION_VIEW]: RightModel.RIGHTS_ONLY_RESPONSIBLE,
                [RightModel.ACTION_DELETE]: RightModel.RIGHTS_FULL,
                [RightModel.ACTION_EXPORT]: RightModel.RIGHTS_ONLY_RESPONSIBLE,
                [RightModel.ACTION_EDIT]: RightModel.RIGHTS_FULL,
            })
            .setContactsRights({
                [RightModel.ACTION_ADD]: RightModel.RIGHTS_DENIED,
                [RightModel.ACTION_VIEW]: RightModel.RIGHTS_ONLY_RESPONSIBLE,
                [RightModel.ACTION_DELETE]: RightModel.RIGHTS_FULL,
                [RightModel.ACTION_EXPORT]: RightModel.RIGHTS_ONLY_RESPONSIBLE,
                [RightModel.ACTION_EDIT]: RightModel.RIGHTS_FULL,
            })
            .setTasksRights({
                [RightModel.ACTION_DELETE]: RightModel.RIGHTS_FULL,
                [RightModel.ACTION_EDIT]: RightModel.RIGHTS_FULL,
            })
            .setMailAccess(false)
            .setCatalogAccess(true)
            .setStatusRights(
                [
                    {
                        entity_type: EntityTypes.LEADS,
                        pipeline_id: 3166396,
                        status_id: 142,
                        rights: {
                            [RightModel.ACTION_ADD]: RightModel.RIGHTS_DENIED,
                            [RightModel.ACTION_VIEW]: RightModel.RIGHTS_ONLY_RESPONSIBLE,
                            [RightModel.ACTION_DELETE]: RightModel.RIGHTS_FULL,
                            [RightModel.ACTION_EXPORT]: RightModel.RIGHTS_FULL,
                        },
                    },
                ]
            )
    );

try {
    roleModel = await rolesService.addOne(roleModel);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
    }
}


//Изменим имя роли
roleModel.setName('Новое имя');
roleModel.getRights().setMailAccess(true);
try {
    roleModel = await rolesService.updateOne(roleModel);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
    }
}

//Получим роли аккаунта
try {
    const rolesCollection = await rolesService.get(null, [RoleModel.USERS]);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}
