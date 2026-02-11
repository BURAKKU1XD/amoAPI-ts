import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    EntityTypes,
    CustomFieldGroupsCollection,
    AmoCRMApiException,
    CustomFieldGroupModel,
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

//Сервис групп полей
let customFieldGroupsService;
try {
    customFieldGroupsService = apiClient.customFieldGroups(EntityTypes.LEADS);
    // Пример для списков
    //customFieldGroupsService = apiClient.customFieldGroups(EntityTypes.CATALOGS + ':' + catalogId);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Создадим группу полей
let customFieldGroupsCollection = new CustomFieldGroupsCollection();
const cfGroup = new CustomFieldGroupModel();
cfGroup.setName('Группа полей');
cfGroup.setSort(15);
customFieldGroupsCollection.add(cfGroup);
try {
    //Добавим группу
    customFieldGroupsCollection = await customFieldGroupsService!.add(customFieldGroupsCollection);

    //Получим объект группы и удалим его
    const groupToDelete = customFieldGroupsCollection.getBy('name', 'Группа полей');
    await customFieldGroupsService!.deleteOne(groupToDelete);

    //Получим группы (это же пример :) )
    customFieldGroupsCollection = await customFieldGroupsService!.get();
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

console.log(customFieldGroupsCollection);
process.exit(1);
