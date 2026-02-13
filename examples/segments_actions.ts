import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    AmoCRMApiException,
    CustomFieldsValuesCollection,
    EntityTypes,
    SegmentModel,
    TextCustomFieldModel,
    TextCustomFieldValuesModel,
    TextCustomFieldValueCollection,
    TextCustomFieldValueModel,
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

//Сервис сегментов
const segmentsService = apiClient.customersSegments();

//Получим сегменты аккаунта
try {
    const segmentsCollection = await segmentsService.get();
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}


//Создадим сегмент
let segmentModel = new SegmentModel();
segmentModel
    .setName('Новый сегмент')
    .setColor('ff5376');

try {
    segmentModel = await segmentsService.addOne(segmentModel);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}

const segmentsCustomFieldsService = apiClient.customFields(EntityTypes.CUSTOMERS_SEGMENTS);

let field;
try {
    field = await segmentsCustomFieldsService.addOne(
        new TextCustomFieldModel()
            .setName('Поле текст')
    );
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}

segmentModel.setCustomFieldsValues(
    new CustomFieldsValuesCollection()
        .add(
            new TextCustomFieldValuesModel()
                .setFieldId(field.getId())
                .setValues(
                    new TextCustomFieldValueCollection()
                        .add(new TextCustomFieldValueModel().setValue('Текст'))
                )
        )
);

//Обновим сегмент
try {
    segmentModel = await segmentsService.updateOne(segmentModel);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}


//Освежим модель
try {
    segmentModel = await segmentsService.syncOne(segmentModel);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}

console.log(segmentModel);
