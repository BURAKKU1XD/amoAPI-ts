import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    HasParentEntity,
    NotesFilter,
    EntityTypes,
    NotesCollection,
    AmoCRMApiException,
    NoteFactory,
    CallInterface,
    CallInNote,
    ServiceMessageNote,
    SmsOutNote,
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

//Создадим примечания
let notesCollection = new NotesCollection();
const serviceMessageNote = new ServiceMessageNote();
serviceMessageNote.setEntityId(1)
    .setText('Текст примечания')
    .setService('Api Library')
    .setCreatedBy(0);

const callInNote = new CallInNote();
callInNote.setEntityId(1)
    .setPhone('+7912312321')
    .setCallStatus(CallInterface.CALL_STATUS_SUCCESS_CONVERSATION)
    .setCallResult('Разговор состоялся')
    .setDuration(148)
    .setUniq(uuidv4())
    .setSource('integration name')
    .setLink('https://example.test/test.mp3');

const smsNote = new SmsOutNote();
smsNote.setEntityId(1)
    .setText('Исходящее SMS')
    .setPhone('+7912312321')
    .setCreatedBy(0);

notesCollection.add(serviceMessageNote);
notesCollection.add(smsNote);
notesCollection.add(callInNote);

let leadNotesService;
try {
    leadNotesService = apiClient.notes(EntityTypes.LEADS);
    notesCollection = await leadNotesService.add(notesCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Получение примечаний конкретной сущности с фильтром по типу примечания
try {
    notesCollection = await leadNotesService!.getByParentId(1, new NotesFilter().setNoteTypes([NoteFactory.NOTE_TYPE_CODE_CALL_IN]));
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Получение примечаний
try {
    notesCollection = await leadNotesService!.get();
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Получение одного примечания, в метод getOne необходимо передать массив,
//так как для получения конкретного примечания нужно знать и id сущности и id примечания
let noteModel;
try {
    noteModel = await leadNotesService!.getOne({
        [HasParentEntity.ID_KEY]: 9,
        [HasParentEntity.PARENT_ID_KEY]: 1,
    });
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

console.log(noteModel!.toArray());
