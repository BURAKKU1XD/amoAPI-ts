import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    CatalogElementsCollection,
    CompaniesCollection,
    LinksCollection,
    AmoCRMApiException,
    CatalogElementsFilter,
    CompaniesFilter,
    CompanyModel,
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

//Создадим компанию
const company = new CompanyModel();
company.setName('Example');

const companiesCollection = new CompaniesCollection();
companiesCollection.add(company);
try {
    await apiClient.companies().add(companiesCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Получим сделку по ID, сделку и привяжем компанию к сделке
let lead;
try {
    lead = await apiClient.leads().getOne(3916883);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

const links = new LinksCollection();
links.add(lead!);

//Получим элементы из нужного нам каталога, где в названии или полях есть слово кросовки
let catalogElementsCollection = new CatalogElementsCollection();
const catalogElementsService = apiClient.catalogElements(1001);
const catalogElementsFilter = new CatalogElementsFilter();
catalogElementsFilter.setQuery('Кросовки');
try {
    catalogElementsCollection = await catalogElementsService.get(catalogElementsFilter);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

const nikeElement = catalogElementsCollection.getBy('name', 'Кросовки Nike');
if (nikeElement) {
    //Установим кол-во, так как эта модель будет привязана, данное свойство используется только при привязке к сущности
    nikeElement.setQuantity(10);
    links.add(nikeElement);
}

try {
    await apiClient.companies().link(company, links);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Создадим фильтр по id компании
const filter = new CompaniesFilter();
filter.setIds([1]);

//Получим компании по фильтру
let companies: CompaniesCollection;
try {
    companies = await apiClient.companies().get(filter, [CompanyModel.CONTACTS, CompanyModel.LEADS, CompanyModel.CATALOG_ELEMENTS]);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

console.log(companies!.toArray());
