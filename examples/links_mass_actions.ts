import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    LinksCollection,
    AmoCRMApiException,
    EntitiesLinksFilter,
    EntityTypes,
    LinkModel,
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

const links = new LinksCollection()
    .add(
        new LinkModel()
            .setEntityId(2584271)
            .setEntityType(EntityTypes.LEADS)
            .setToEntityId(3135527)
            .setToEntityType(EntityTypes.CONTACTS)
            .setMetadata({ is_main: true })
    )
    .add(
        new LinkModel()
            .setEntityId(2584271)
            .setEntityType(EntityTypes.LEADS)
            .setToEntityId(3100867)
            .setToEntityType(EntityTypes.COMPANIES)
    )
    .add(
        new LinkModel()
            .setEntityId(2584269)
            .setEntityType(EntityTypes.LEADS)
            .setToEntityId(3135527)
            .setToEntityType(EntityTypes.CONTACTS)
            .setMetadata({ is_main: true })
    )
    .add(
        new LinkModel()
            .setEntityId(2584269)
            .setEntityType(EntityTypes.LEADS)
            .setToEntityId(3100867)
            .setToEntityType(EntityTypes.COMPANIES)
    );

const linksService = apiClient.links(EntityTypes.LEADS);

try {
    await linksService.add(links);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

try {
    const filter = new EntitiesLinksFilter([2584269, 2584271]);
    const allLinks = await linksService.get(filter);
    console.log(JSON.stringify(allLinks.toArray()));
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}
