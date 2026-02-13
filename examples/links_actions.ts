import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    LinksCollection,
    AmoCRMApiException,
    CatalogElementModel,
    CompanyModel,
    ContactModel,
    CustomerModel,
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

//Привяжем контакт к покупателю
let linksCollection = new LinksCollection();
linksCollection.add(new CustomerModel().setId(1));
try {
    linksCollection = await apiClient.contacts().link(new ContactModel().setId(7143559), linksCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Или так
linksCollection = new LinksCollection();
linksCollection.add(new ContactModel().setId(7143559));
try {
    linksCollection = await apiClient.customers().link(new CustomerModel().setId(1), linksCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//А этот контакт сделаем главным
linksCollection = new LinksCollection();
linksCollection.add(new ContactModel().setId(9820781).setIsMain(true));
try {
    linksCollection = await apiClient.customers().link(new CustomerModel().setId(1), linksCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}



//Привяжем компанию к покупателю
linksCollection = new LinksCollection();
linksCollection.add(new CustomerModel().setId(1));
try {
    linksCollection = await apiClient.companies().link(new CompanyModel().setId(7964425), linksCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Или так
linksCollection = new LinksCollection();
linksCollection.add(new CompanyModel().setId(7964425));
try {
    linksCollection = await apiClient.customers().link(new CustomerModel().setId(1), linksCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}



//Привяжем элемент каталога к покупателю
linksCollection = new LinksCollection();
linksCollection.add(
    new CatalogElementModel()
        .setCatalogId(2079)
        .setId(174395)
        .setQuantity(10)
);
try {
    linksCollection = await apiClient.customers().link(new CustomerModel().setId(1), linksCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Привяжем элемент каталога к сделке с ценой, которая хранится у товаров в доп поле типа ЦЕНА с ID 123456
linksCollection = new LinksCollection();
linksCollection.add(
    new CatalogElementModel()
        .setCatalogId(2079)
        .setId(174395)
        .setQuantity(10)
        .setPriceId(123456)
);
try {
    linksCollection = await apiClient.customers().link(new LeadModel().setId(1), linksCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}



//Привяжем компанию к контакту
linksCollection = new LinksCollection();
linksCollection.add(new ContactModel().setId(9820777));
try {
    linksCollection = await apiClient.companies().link(new CompanyModel().setId(7964425), linksCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Или так
linksCollection = new LinksCollection();
linksCollection.add(new CompanyModel().setId(7964425));
try {
    linksCollection = await apiClient.contacts().link(new ContactModel().setId(9820777), linksCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}



//Привяжем компанию к сделке
linksCollection = new LinksCollection();
linksCollection.add(new LeadModel().setId(6625001));
try {
    linksCollection = await apiClient.companies().link(new CompanyModel().setId(7964425), linksCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Или так
linksCollection = new LinksCollection();
linksCollection.add(new CompanyModel().setId(7964425));
try {
    linksCollection = await apiClient.leads().link(new LeadModel().setId(6625001), linksCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}
