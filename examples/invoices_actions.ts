import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    BillStatusEnumCode,
    LinksCollection,
    CatalogsFilter,
    LinkedEntityCustomFieldValuesModel,
    NumericCustomFieldValuesModel,
    LinkedEntityCustomFieldValueCollection,
    NumericCustomFieldValueCollection,
    LinkedEntityCustomFieldValueModel,
    CustomFieldsValuesCollection,
    InvoicesCustomFieldsEnums,
    AmoCRMApiException,
    EntityTypes,
    CatalogElementModel,
    ItemsCustomFieldValuesModel,
    LegalEntityCustomFieldValuesModel,
    SelectCustomFieldValuesModel,
    TextCustomFieldValuesModel,
    ItemsCustomFieldValueCollection,
    LegalEntityCustomFieldValueCollection,
    SelectCustomFieldValueCollection,
    TextCustomFieldValueCollection,
    ItemsCustomFieldValueModel,
    LegalEntityCustomFieldValueModel,
    NumericCustomFieldValueModel,
    SelectCustomFieldValueModel,
    TextCustomFieldValueModel,
    LeadModel,
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

//Получим каталоги счетов
let invoicesCatalog;
try {
    const catalogsFilter = new CatalogsFilter();
    catalogsFilter.setType(EntityTypes.INVOICES_CATALOG_TYPE_STRING);
    invoicesCatalog = (await apiClient.catalogs().get(catalogsFilter)).first();
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Получим счета с ссылками на оплату
let invoicesCollection;
try {
    invoicesCollection = await apiClient
        .catalogElements(invoicesCatalog!.getId())
        .get(null, [CatalogElementModel.INVOICE_LINK]);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Возьмем первый счет
const invoice = invoicesCollection!.first();

//Получим ссылку на печатную форму счета
const invoiceLink = invoice.getInvoiceLink();
if (invoiceLink) {
    console.log(invoiceLink);
}

//Получим значения полей
const customFieldValues = invoice.getCustomFieldsValues();

//Получим значение поля Статус
const statusValue = customFieldValues.getBy('fieldCode', InvoicesCustomFieldsEnums.STATUS);
if (statusValue) {
    console.log(statusValue.getValues().first().getValue());

    // обновим статус счета на "Частично оплачен"
    // подробнее о статусах смотрите в examples/custom_field_select_actions.ts
    const statusCustomFieldValueModel = new SelectCustomFieldValuesModel();
    statusCustomFieldValueModel.setFieldCode(InvoicesCustomFieldsEnums.STATUS);
    statusCustomFieldValueModel.setValues(
        new SelectCustomFieldValueCollection()
            .add(new SelectCustomFieldValueModel().setEnumCode(BillStatusEnumCode.PARTIALLY_PAID))
    );

    await apiClient.catalogElements(invoicesCatalog!.getId()).updateOne(
        invoice.setCustomFieldsValues(
            new CustomFieldsValuesCollection().add(statusCustomFieldValueModel)
        )
    );
}
//Получим значение поля Юр. лицо
const legalEntityValue = customFieldValues.getBy('fieldCode', InvoicesCustomFieldsEnums.LEGAL_ENTITY);
if (legalEntityValue) {
    console.log(legalEntityValue.getValues().first().getValue());
}
//Получим значение поля Плательщик
const payerValue = customFieldValues.getBy('fieldCode', InvoicesCustomFieldsEnums.PAYER);
if (payerValue) {
    console.log(payerValue.getValues().first().getValue());
}
//Получим значение привязанные товары
const itemsValue = customFieldValues.getBy('fieldCode', InvoicesCustomFieldsEnums.ITEMS);
if (itemsValue) {
    for (const value of itemsValue.getValues()) {
        console.log(value.getValue());
    }
}
//Получим значение поля Комментарий
const commentField = customFieldValues.getBy('fieldCode', InvoicesCustomFieldsEnums.COMMENT);
if (commentField) {
    console.log(commentField.getValues().first().getValue());
}
//Получим значение поля Итоговая сумма к оплате
const priceValue = customFieldValues.getBy('fieldCode', InvoicesCustomFieldsEnums.PRICE);
if (priceValue) {
    console.log(priceValue.getValues().first().getValue());
}
//Получим значение поля Тип НДС
const vatValue = customFieldValues.getBy('fieldCode', InvoicesCustomFieldsEnums.VAT_TYPE);
if (vatValue) {
    console.log(vatValue.getValues().first().getValue());
}
//Получим значение поля Дата оплаты, имеет значение, только если счет в статусе оплачен
const paymentDateValue = customFieldValues.getBy('fieldCode', InvoicesCustomFieldsEnums.PAYMENT_DATE);
if (paymentDateValue) {
    console.log(paymentDateValue.getValues().first().getValue());
}


//Создадим новый счет
//Обязательно должно быть название и заполнено поле статус
const newInvoice = new CatalogElementModel();
//Зададим Имя
newInvoice.setName('Счет #238');
//Зададим дату создания
const creationDate = new Date('2021-05-15 10:00:00');
newInvoice.setCreatedAt(Math.floor(creationDate.getTime() / 1000));

const invoiceCustomFieldsValues = new CustomFieldsValuesCollection();
//Зададим статус
const statusCfValueModel = new SelectCustomFieldValuesModel();
statusCfValueModel.setFieldCode(InvoicesCustomFieldsEnums.STATUS);
statusCfValueModel.setValues(
    new SelectCustomFieldValueCollection()
        .add(new SelectCustomFieldValueModel().setValue('Оплачен в аванс')) //Текст должен совпадать с одним из значений поля статус
);
invoiceCustomFieldsValues.add(statusCfValueModel);
//Зададим комментарий
const commentCustomFieldValueModel = new TextCustomFieldValuesModel();
commentCustomFieldValueModel.setFieldCode(InvoicesCustomFieldsEnums.COMMENT);
commentCustomFieldValueModel.setValues(
    new TextCustomFieldValueCollection()
        .add(new TextCustomFieldValueModel().setValue('Текст комментария к счету'))
);
invoiceCustomFieldsValues.add(commentCustomFieldValueModel);
//Зададим плательщика (до поле связанная сущность, может хранить в себе связь с сущностью (контакт или компания))
const payerCustomFieldValueModel = new LinkedEntityCustomFieldValuesModel();
payerCustomFieldValueModel.setFieldCode(InvoicesCustomFieldsEnums.PAYER);
payerCustomFieldValueModel.setValues(
    new LinkedEntityCustomFieldValueCollection()
        .add(
            new LinkedEntityCustomFieldValueModel()
                //setName('Вася Пупкин') //Можно передать или название сущности, или ID сущности, чтобы заполнить это поле
                .setEntityId(11014723)
                .setEntityType(EntityTypes.CONTACTS)
        )
);
invoiceCustomFieldsValues.add(payerCustomFieldValueModel);
//Зададим юр. лицо, от имени которого выставлен счёт
const legalEntityCustomFieldValueModel = new LegalEntityCustomFieldValuesModel();
legalEntityCustomFieldValueModel.setFieldCode(InvoicesCustomFieldsEnums.LEGAL_ENTITY);
legalEntityCustomFieldValueModel.setValues(
    new LegalEntityCustomFieldValueCollection()
        .add(
            new LegalEntityCustomFieldValueModel()
                .setName('ООО "Рога и копыта"')
                .setLegalEntityType(LegalEntityCustomFieldValueModel.LEGAL_ENTITY_TYPE_JURIDICAL_PERSON)
                .setVatId('05124214')
                .setTaxRegistrationReasonCode('0124125125')
                .setAddress('Москва, Красная площадь, дом 1')
                .setKpp('124352279')
                .setBankCode('023532795')
                .setExternalUid('125125-4457xcsf-erhery')
        )
);
invoiceCustomFieldsValues.add(legalEntityCustomFieldValueModel);
//Зададим товары в счете
const itemsCustomFieldValueModel = new ItemsCustomFieldValuesModel();
itemsCustomFieldValueModel.setFieldCode(InvoicesCustomFieldsEnums.ITEMS);
itemsCustomFieldValueModel.setValues(
    new ItemsCustomFieldValueCollection()
        .add(
            new ItemsCustomFieldValueModel()
                .setDescription('Описание товара')
                .setExternalUid('ID товара во внешней учетной системе')
                //.setProductId('ID товара в списке товаров в amoCRM') //Необязательное поле
                .setQuantity(10) //количество
                .setSku('Артикул товара')
                .setUnitPrice(150) //цена за единицу товара
                .setUnitType('кг') //единица измерения товара
                .setVatRateValue(20) //НДС 20%
                .setDiscount({
                    type: ItemsCustomFieldValueModel.FIELD_DISCOUNT_TYPE_AMOUNT, //amount - скидка абсолютная, percentage - скидка в процентах от стоимости товара
                    value: 15.15 //15 рублей 15 копеек
                })
                .setBonusPointsPerPurchase(20) //Сколько бонусных баллов будет начислено за покупку
        )
);
invoiceCustomFieldsValues.add(itemsCustomFieldValueModel);
//Зададим значение поля Итоговая сумма к оплате
//Отображается в списке счетов,
//при заходе в карточку счета, стоимость счета будет рассчитана с учетом товаров, ндс и отображена в карточке счета
//Если передать некорректную сумму, то до редактирования в интерфейсе, через API будет возвращаться некорректная сумма
const priceCustomFieldValueModel = new NumericCustomFieldValuesModel();
priceCustomFieldValueModel.setFieldCode(InvoicesCustomFieldsEnums.PRICE);
priceCustomFieldValueModel.setValues(
    new NumericCustomFieldValueCollection()
        .add(
            new NumericCustomFieldValueModel()
                .setValue(100)
        )
);
invoiceCustomFieldsValues.add(priceCustomFieldValueModel);
//Зададим Тип НДС
const vatTypeCustomFieldValueModel = new SelectCustomFieldValuesModel();
vatTypeCustomFieldValueModel.setFieldCode(InvoicesCustomFieldsEnums.VAT_TYPE);
vatTypeCustomFieldValueModel.setValues(
    new SelectCustomFieldValueCollection()
        .add(new SelectCustomFieldValueModel().setValue("НДС начисляется поверх стоимости"))
);
invoiceCustomFieldsValues.add(vatTypeCustomFieldValueModel);

//Установим значения в модель и сохраним
newInvoice.setCustomFieldsValues(invoiceCustomFieldsValues);
const catalogElementsService = apiClient.catalogElements(invoicesCatalog!.getId());
let savedInvoice;
try {
    savedInvoice = await catalogElementsService.addOne(newInvoice);
    console.log('ID счета - ' + savedInvoice.getId());
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Свяжем счет со сделкой с ID 7856057
const leadsService = apiClient.leads();
const lead = new LeadModel()
    .setId(7856057);
try {
    await leadsService.link(lead, new LinksCollection().add(savedInvoice!));
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Обновим статус счета, без изменения других полей
const invoiceForUpdate = new CatalogElementModel()
    .setId(savedInvoice!.getId())
    .setCatalogId(invoicesCatalog!.getId())
    .setCustomFieldsValues(
        new CustomFieldsValuesCollection()
            .add(
                new SelectCustomFieldValuesModel()
                    .setFieldCode(InvoicesCustomFieldsEnums.STATUS)
                    .setValues(
                        new SelectCustomFieldValueCollection()
                            .add(new SelectCustomFieldValueModel().setValue('Оплачен')) //Текст должен совпадать с одним из значений поля статус
                    )
            )
    );

try {
    const updatedInvoice = await catalogElementsService.updateOne(invoiceForUpdate);
    console.log('ID обновленного счета - ' + updatedInvoice.getId());
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Получим значения поля статус
const invoicesCfService = apiClient.customFields(EntityTypes.CATALOGS + ':' + invoicesCatalog!.getId());
let invoicesCfsCollection;
try {
    invoicesCfsCollection = await invoicesCfService.get();
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}
const invoiceStatusField = invoicesCfsCollection!.getBy('code', InvoicesCustomFieldsEnums.STATUS);
for (const enumItem of invoiceStatusField.getEnums()) {
    console.log('Значение поля ' + enumItem.getValue() + ' с ID ' + enumItem.getId());
}
