import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    TagColorsEnum,
    TagsFilter,
    EntityTypes,
    LeadsCollection,
    TagsCollection,
    AmoCRMApiException,
    LeadModel,
    TagModel,
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

//Создадим тег с цветом (цвета можно задавать только у тегов сделок)
let tagsCollection = new TagsCollection();
const tag = new TagModel();
tag.setName('новый тег');
tag.setColor(TagColorsEnum.LAPIS_LAZULI);
tagsCollection.add(tag);
const tagsService = apiClient.tags(EntityTypes.LEADS);

try {
    await tagsService.add(tagsCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}
tagsCollection.first().setId(69079); //убрать, когда будет request_id в тегах

//Найдем тег
const tagsFilter = new TagsFilter();
tagsFilter.setQuery('новый тег');
try {
    tagsCollection = await apiClient.tags(EntityTypes.LEADS).get(tagsFilter);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}


//Создадим сделку с найденным тегом
const lead = new LeadModel();
lead.setName('Example');
lead.setTags(tagsCollection);

const leadsCollection = new LeadsCollection();
leadsCollection.add(lead);
await apiClient.leads().add(leadsCollection);
