import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    SourceServiceTypeEnum,
    SourceServicesCollection,
    SourceServicesPagesCollection,
    SourcesCollection,
    AmoCRMApiException,
    SourceModel,
    SourceServiceModel,
    SourceServicePageModel,
    SourcesFilter,
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

const r = Date.now().toString();
const phoneNumber = '+7 (912) 123 12 12' + r;
//Создадим источник
let sourcesCollection = new SourcesCollection();
let source = new SourceModel();
source.setName('New Source');
// Внешний код не обязательно должен быть телефоном,
// просто уникально идентифицируемая строке (ограничения описаны в документации)
source.setExternalId(phoneNumber);

// если нужно отображать интеграцию в кнопке whatsapp в crm_plugin добавим сервис
const page = new SourceServicePageModel();
page.setLink('+7912123122');
page.setName(source.getName());
page.setId(page.getLink());

const whatsappSourceService = new SourceServiceModel();
whatsappSourceService.setType(SourceServiceTypeEnum.TYPE_WHATSAPP);
whatsappSourceService.setPages(SourceServicesPagesCollection.make([page]));
source.setServices(SourceServicesCollection.make([whatsappSourceService]));

sourcesCollection.add(source);
const sourcesService = apiClient.sources();

try {
    await sourcesService.add(sourcesCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}
console.log('Added source: ');
console.log(sourcesCollection.toArray());
console.log('\n');

sourcesCollection.first().setName('Source: +7 (912) 123 12 12');

try {
    await sourcesService.update(sourcesCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Найдем источник
const sourcesFilter = new SourcesFilter();
sourcesFilter.setExternalIds([phoneNumber]);
try {
    sourcesCollection = await apiClient.sources().get(sourcesFilter);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

source = sourcesCollection.first();
console.log(`Updated source: ${source.getName()}, services: ${JSON.stringify(source.getServices()!.toArray())}`);


//Найдем источник по id
try {
    source = await apiClient.sources().getOne(source.getId());
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

console.log('Source found by Id: ');
console.log(source.toArray());

source.setName('Updated-' + source.getName());
try {
    source = await apiClient.sources().updateOne(source);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

console.log('Source found by Id: ');
console.log(sourcesCollection.toArray());


let isDeleted = false;
try {
    isDeleted = await apiClient.sources().deleteOne(source);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

console.log(`Source ${source.getId()} is ${isDeleted ? 'deleted' : 'not deleted'}`);

try {
    source = await apiClient.sources().getOne(source.getId());
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        if (e.getErrorCode() === 204) {
            console.log("Really deleted");
        } else {
            printError(e);
            process.exit(1);
        }
    }
}

sourcesCollection = new SourcesCollection();
const sourceA = new SourceModel();
sourceA.setName('New SourceA');
sourceA.setDefault(true);
sourceA.setExternalId('first-' + Date.now().toString());
sourcesCollection.add(sourceA);

const sourceB = new SourceModel();
sourceB.setName('New SourceB ');
sourceB.setExternalId('second-' + Date.now().toString());
sourcesCollection.add(sourceB);

try {
    await sourcesService.add(sourcesCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}
console.log(`Sources added: ${sourceA.getId()}, ${sourceB.getId()}`);

let existingSourcesCollection;
try {
    existingSourcesCollection = await apiClient.sources().get();
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}
const foundSourceA = existingSourcesCollection!.getBy('id', sourceA.getId());
const foundSourceB = existingSourcesCollection!.getBy('id', sourceB.getId());

console.log(`Source A is ${foundSourceA.isDefault() ? 'default' : 'not default'}`);
console.log(`Source B is ${foundSourceB.isDefault() ? 'default' : 'not default'}`);

isDeleted = false;
try {
    isDeleted = await apiClient.sources().delete(sourcesCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}
console.log(`Sources A & B are ${isDeleted ? 'deleted' : 'not deleted'}`);


try {
    existingSourcesCollection = await apiClient.sources().get();
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

const existingIds = existingSourcesCollection!.pluck('id');
const stillExists = [sourceA.getId(), sourceB.getId()].filter(id => existingIds.includes(id));
console.log(`Sources A & B are ${stillExists.length === 0 ? 'really deleted' : 'still exists'}`);
