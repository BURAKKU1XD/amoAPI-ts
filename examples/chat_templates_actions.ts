import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    AmoCRMApiException,
    ButtonsCollection,
    TextButtonModel,
    ReviewModel,
    TemplateModel,
    TemplatesFilter,
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


const chatTemplatesService = apiClient.chatTemplates();

// Создадим редактируемый шаблон
let chatTemplate: TemplateModel = new TemplateModel();
chatTemplate
    .setName('Название шаблона')
    .setContent('Название сделки - {{lead.name}}')
    .setExternalId('qwedsgfsdg-dsgsdg') //Идентификатор шаблона на стороне интеграции
    .setIsEditable(true);

try {
    chatTemplate = await chatTemplatesService.addOne(chatTemplate);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}
console.log('Добавленный шаблон: ');
console.log(chatTemplate.toArray());
console.log('\n');


// Обновим шаблон и добавим в него кнопки. Кнопок разного типа быть не может
// Также сменим тип шаблона на WhatsApp
const buttonsCollection = new ButtonsCollection();
buttonsCollection
    .add(
        new TextButtonModel().setText('Текст кнопки')
    )
    .add(
        new TextButtonModel().setText('Текст кнопки2')
    );
chatTemplate.setButtons(buttonsCollection);
chatTemplate.setType(TemplateModel.TYPE_WABA);
chatTemplate.setWabaCategory(TemplateModel.CATEGORY_UTILITY);
chatTemplate.setWabaFooter('Футер шаблона');
chatTemplate.setWabaExamples({ '{{lead.name}}': 'Заявка из WhatsApp' });
chatTemplate.setWabaLanguage('ru');


try {
    chatTemplate = await chatTemplatesService.updateOne(chatTemplate);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}

console.log('Обновлённый шаблон: ');
console.log(chatTemplate.toArray());
console.log('\n');

// Отправим шаблон WhatsApp на проверку
try {
    var reviews = await chatTemplatesService.sendOnReview(chatTemplate);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}

console.log('Статусы шаблона: ');
console.log(reviews.toArray());
console.log('\n');

// Получим шаблоны со статусами
let chatTemplatesCollection;
try {
    chatTemplatesCollection = await chatTemplatesService.get(null, TemplateModel.getAvailableWith());
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}
console.log(chatTemplatesCollection.toArray());

let template: TemplateModel | null = null;
let review: ReviewModel | null = null;

// Найдём шаблон со статусом review
for (const chatTemplateItem of chatTemplatesCollection) {
    const templateReviews = chatTemplateItem.getReviews();

    if (templateReviews === null) {
        continue;
    }

    for (const templateReview of templateReviews) {
        if (templateReview.getStatus() === ReviewModel.STATUS_REVIEW_NAME) {
            review = templateReview;
            break;
        }
    }

    if (review) {
        template = chatTemplateItem;
        break;
    }
}

// Если нашли - поставим статус отказ
if (review && template) {
    try {
        const updatedReview = await chatTemplatesService.updateReviewStatus(
            template,
            review.setStatus(ReviewModel.STATUS_REJECTED_NAME).setRejectReason('Does not fit')
        );

        console.log('Шаблон с отказаом: ');
        console.log(updatedReview.toArray());
        console.log('\n');
    } catch (e: any) {
        if (e instanceof AmoCRMApiException) {
            printError(e);
            process.exit(1);
        }
        throw e;
    }
}

// Получим шаблоны по ExternalId
const templatesFilter = new TemplatesFilter();
templatesFilter.setExternalIds(['qwedsgfsdg-dsgsdg']);
try {
    chatTemplate = (await chatTemplatesService.get(templatesFilter)).first();
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}
console.log(chatTemplate.toArray());

// Удалим первый шаблон
try {
    await chatTemplatesService.deleteOne(chatTemplate);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
    throw e;
}
