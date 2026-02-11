import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    AmoCRMApiException,
    UsersCollection,
    UserModel,
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

//Сервис пользователей
const usersService = apiClient.users();

//Создадим пользователей
let usersCollection = new UsersCollection();

const userModel = new UserModel();
userModel
    .setName('Иван Петров')
    .setEmail('example3@example.test')
    .setPassword('ExAmPlE2o20!')
    .setLang('ru')
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
            .setGroupId(286084)
    );
usersCollection.add(userModel);

const freeUserModel = new UserModel();
freeUserModel
    .setName('Иван Мещеряков')
    .setEmail('example2@example.test')
    .setPassword('ExAmPlE2o18!')
    .setLang('ru')
    .setRights(
        new RightModel()
            .setIsFree(true)
    );
usersCollection.add(freeUserModel);

const userWithRole = new UserModel();
userWithRole
    .setName('Елена Иванова')
    .setEmail('example1@example.test')
    .setPassword('ExAmPlE2o19!')
    .setLang('ru')
    .setRights(
        new RightModel()
            .setRoleId(107995)
    );
usersCollection.add(userWithRole);

try {
    usersCollection = await usersService.add(usersCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}

//Получим всех пользователей аккаунта
try {
    usersCollection = await usersService.get();
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}

console.log(usersCollection.toArray());
