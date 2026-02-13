import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    EntityTypes,
    RightModel,
    UserModel,
    AmoCRMApiErrorResponseException,
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

const usersService = apiClient.users();

let userModel = new UserModel();
userModel
    .setName('Иван Петров')
    .setEmail('example12671@example.test')
    .setPassword('ExAmPlE2o20!')
    .setLang('ru')
    .setRights(
        new RightModel()
            .setLeadsRights({
                [RightModel.ACTION_ADD]: RightModel.RIGHTS_DENIED,
                [RightModel.ACTION_VIEW]: RightModel.RIGHTS_ONLY_RESPONSIBLE,
                [RightModel.ACTION_DELETE]: RightModel.RIGHTS_ONLY_RESPONSIBLE,
                [RightModel.ACTION_EXPORT]: RightModel.RIGHTS_ONLY_RESPONSIBLE,
                [RightModel.ACTION_EDIT]: RightModel.RIGHTS_ONLY_RESPONSIBLE,
            })
            .setCompaniesRights({
                [RightModel.ACTION_ADD]: RightModel.RIGHTS_DENIED,
                [RightModel.ACTION_VIEW]: RightModel.RIGHTS_ONLY_RESPONSIBLE,
                [RightModel.ACTION_DELETE]: RightModel.RIGHTS_ONLY_RESPONSIBLE,
                [RightModel.ACTION_EXPORT]: RightModel.RIGHTS_ONLY_RESPONSIBLE,
                [RightModel.ACTION_EDIT]: RightModel.RIGHTS_ONLY_RESPONSIBLE,
            })
            .setContactsRights({
                [RightModel.ACTION_ADD]: RightModel.RIGHTS_DENIED,
                [RightModel.ACTION_VIEW]: RightModel.RIGHTS_ONLY_RESPONSIBLE,
                [RightModel.ACTION_DELETE]: RightModel.RIGHTS_ONLY_RESPONSIBLE,
                [RightModel.ACTION_EXPORT]: RightModel.RIGHTS_ONLY_RESPONSIBLE,
                [RightModel.ACTION_EDIT]: RightModel.RIGHTS_ONLY_RESPONSIBLE,
            })
            .setTasksRights({
                [RightModel.ACTION_DELETE]: RightModel.RIGHTS_FULL,
                [RightModel.ACTION_EDIT]: RightModel.RIGHTS_FULL,
            })
            .setMailAccess(false)
            .setCatalogRights(
                [
                    {
                        catalog_id: 5025,
                        rights: {
                            [RightModel.ACTION_ADD]: RightModel.RIGHTS_DENIED,
                            [RightModel.ACTION_VIEW]: RightModel.RIGHTS_FULL,
                            [RightModel.ACTION_EDIT]: RightModel.RIGHTS_LINKED,
                            [RightModel.ACTION_DELETE]: RightModel.RIGHTS_LINKED,
                            [RightModel.ACTION_EXPORT]: RightModel.RIGHTS_LINKED,
                        },
                    }
                ]
            )
            .setStatusRights(
                [
                    {
                        entity_type: EntityTypes.LEADS,
                        pipeline_id: 3858604,
                        status_id: 142,
                        rights: {
                            [RightModel.ACTION_ADD]: RightModel.RIGHTS_DENIED,
                            [RightModel.ACTION_VIEW]: RightModel.RIGHTS_FULL,
                            [RightModel.ACTION_DELETE]: RightModel.RIGHTS_FULL,
                            [RightModel.ACTION_EXPORT]: RightModel.RIGHTS_FULL,
                        },
                    },
                ]
            )
    );

try {
    userModel = await usersService.addOne(userModel);
} catch (e: any) {
    if (e instanceof AmoCRMApiErrorResponseException) {
        console.log(e.message);
        console.log(JSON.stringify(e.getValidationErrors()));
        process.exit(1);
    }
}

console.log(JSON.stringify(userModel.toArray()));
