import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    AmoCRMApiException,
    FileLinksCollection,
    FilesFilter,
    FileLinkModel,
    FileModel,
    FileUploadModel,
    CustomFieldsValuesCollection,
    TypesEnum,
    EntityTypes,
    AttachmentModel,
    FileCustomFieldValuesModel,
    FileCustomFieldValueCollection,
    FileCustomFieldValueModel,
    LeadModel,
    AttachmentNote,
    TemplateModel,
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


// Получим список файлов
const filter = new FilesFilter();
filter.setExtensions(['jpg', 'jpeg', 'png']); // фильтр, который ищет все изображения
//filter.setDeleted(true); // фильтр, который ищет только среди удаленных файлов

try {
    const files = await apiClient.files().get(filter);
    console.log(files.toArray());
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
    }
}


// Получим модель файла
try {
    const file = await apiClient.files().getOne('83bd6974-d54e-4fed-9fec-a3e5a31220db');
    console.log(file.toArray());
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
    }
}


// Освежим модель файла
let file!: FileModel;
try {
    file = new FileModel();
    file.setUuid('6639ccbf-4bc6-4a08-8537-65adb868967d');
    file = await apiClient.files().syncOne(file);
    console.log(file.toArray());
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
    }
}


// Изменим имя у найденного файла
try {
    file.setName('Новое название файла');
    file = await apiClient.files().updateOne(file);
    console.log(file.toArray());
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
    }
}


// Загрузим файл
const uploadModel = new FileUploadModel();
uploadModel.setName('Название файла123.txt')
    .setLocalPath('/tmp/123');

try {
    file = await apiClient.files().uploadOne(uploadModel);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
    }
}


// Установим файл в поле сделки загруженный файл
const leadsService = apiClient.leads();

const lead = new LeadModel();
lead.setName('Название сделки')
    .setPrice(54321)
    .setCustomFieldsValues(
        new CustomFieldsValuesCollection()
            .add(
                new FileCustomFieldValuesModel()
                    .setFieldId(1154281)
                    .setValues(
                        new FileCustomFieldValueCollection()
                            .add(
                                new FileCustomFieldValueModel()
                                    .setFileUuid(file.getUuid())
                                    .setVersionUuid(file.getVersionUuid()) // Можно не передавать, тогда будет использована последняя версия
                                    .setFileName(file.getName()) // Можно не передавать, тогда название в интерфейсе отобразиться с небольшой задержкой
                                    .setFileSize(file.getSize()) // Можно не передавать, тогда размер в интерфейсе отобразиться с небольшой задержкой
                            ) // Для того, чтобы заменить файл, обновлять поле не нужно, нужно загрузить файл с передачей file_uuid
                    )
            )
    );

try {
    const createdLead = await leadsService.addOne(lead);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}


// Создадим шаблон сообщений с файлом
const chatTemplatesService = apiClient.chatTemplates();

const chatTemplate = new TemplateModel();
chatTemplate
    .setName('Название шаблона1')
    .setContent('Название сделки - {{lead.name}}')
    .setExternalId('qwedsgfsdg-dsgsdg') //Идентификатор шаблона на стороне интеграции
    .setIsEditable(true)
    .setAttachment(
        new AttachmentModel()
            .setName(file.getName())
            .setId(file.getUuid())
            .setType(TypesEnum.TYPE_PICTURE)
    );

try {
    const createdTemplate = await chatTemplatesService.addOne(chatTemplate);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}


// Создадим примечание с файлом
const noteModel = new AttachmentNote();
noteModel.setEntityId(20285255)
    .setFileName(file.getNameWithExtension()) // название файла, которое будет отображаться в примечании
    .setVersionUuid(file.getVersionUuid())
    .setFileUuid(file.getUuid());

try {
    const leadNotesService = apiClient.notes(EntityTypes.LEADS);
    const createdNote = await leadNotesService.addOne(noteModel);
    console.log(createdNote.toArray());
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}


//Удалим файл
//try {
//    const result = await apiClient.files().deleteOne(file);
//    console.log(result);
//} catch (e: any) {
//    if (e instanceof AmoCRMApiException) {
//        printError(e);
//    }
//}


// Привяжем файл к сделке с ID 21825653, чтобы он отображался во вкладке файлы
try {
    const result = await apiClient.entityFiles(EntityTypes.LEADS, 21825653).add(
        new FileLinksCollection()
            .add(
                new FileLinkModel()
                    .setFileUuid(file.getUuid())
            )
    );
    console.log(result);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
    }
}

// Получим все файлы, связанные со сделкой 21825653
try {
    const result = await apiClient.entityFiles(EntityTypes.LEADS, 21825653).get();
    console.log(result);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
    }
}

// Отвяжем файл от сделки с ID 21825653
try {
    const result = await apiClient.entityFiles(EntityTypes.LEADS, 21825653).delete(
        new FileLinksCollection()
            .add(
                new FileLinkModel()
                    .setFileUuid(file.getUuid())
            )
    );
    console.log(result);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
    }
}
