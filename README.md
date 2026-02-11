![amoCRM API Library](.github/logo.png?raw=true)

# amoCRM API Library

[![npm version](https://img.shields.io/npm/v/amocrm-api-library)](https://www.npmjs.com/package/amocrm-api-library)
[![Build Status](https://img.shields.io/github/actions/workflow/status/amocrm/amocrm-api-library/ci.yml?branch=master)](https://github.com/amocrm/amocrm-api-library/actions)
[![Downloads](https://img.shields.io/npm/dt/amocrm-api-library)](https://www.npmjs.com/package/amocrm-api-library)

В данном пакете представлен API клиент с поддержкой основных сущностей и авторизацией по протоколу OAuth 2.0 в amoCRM.
Для работы библиотеки требуется Node.js версии не ниже 16.0.0.

## Оглавление
- [Установка](#установка)
- [Начало работы](#начало-работы-и-авторизация)
- [Авторизация с долгоживущим токеном](#авторизация-с-долгоживущим-токеном)
- [Подход к работе с библиотекой](#подход-к-работе-с-библиотекой)
- [Поддерживаемые методы и сервисы](#поддерживаемые-методы-и-сервисы)
- [Обработка ошибок](#обработка-ошибок)
- [Фильтры](#фильтры)
- [Работа с Custom Fields сущностей](#работа-с-дополнительными-полями-сущностей)
- [Работа с тегами сущностей](#работа-с-тегами-сущностей)
- [Особенности работы с источниками](#особенности-работы-с-источниками)
- [Константы](#константы)
- [Работа в случае смены субдомена аккаунта](#работа-в-случае-смены-субдомена-аккаунта)
- [Одноразовые токены интеграций, расшифровка](#одноразовые-токены-интеграций-расшифровка)
- [Работа с валютами](#работа-с-валютами)
- [Примеры](#примеры)

## Установка

Установить библиотеку можно с помощью npm:

```
npm install amocrm-api-library
```

## Начало работы и авторизация

Для начала использования вам необходимо создать объект библиотеки:
```typescript
import { AmoCRMApiClient } from 'amocrm-api-library';

const apiClient = new AmoCRMApiClient(clientId, clientSecret, redirectUri);
```

Также предоставляется фабрика для создания объектов `AmoCRMApiClientFactory`.
Для ее использования вам нужно реализовать интерфейс `OAuthConfigInterface` и `OAuthServiceInterface`

```typescript
import { AmoCRMApiClientFactory } from 'amocrm-api-library';

const apiClientFactory = new AmoCRMApiClientFactory(oAuthConfig, oAuthService);
const apiClient = apiClientFactory.make();
```

При использовании фабрики вам не нужно устанавливать callback onAccessTokenRefresh, при обновлении токена будет вызван метод saveOAuthToken из oAuthService (`OAuthServiceInterface`).

Затем необходимо создать объект (`AccessToken`) Access токена из вашего хранилища токенов и установить его в API клиент.

Также необходимо установить домен аккаунта amoCRM в виде СУБДОМЕН.amocrm.(ru/com).

Вы можете установить функцию-callback на событие обновления Access токена, если хотите дополнительно обрабатывать новый токен (например сохранять его в хранилище токенов):
```typescript
import { AccessTokenInterface } from 'amocrm-api-library';

apiClient.setAccessToken(accessToken)
        .setAccountBaseDomain(accessToken.getValues()['baseDomain'])
        .onAccessTokenRefresh(
            async (accessToken: AccessTokenInterface, baseDomain: string) => {
                saveToken(
                    {
                        accessToken: accessToken.getToken(),
                        refreshToken: accessToken.getRefreshToken(),
                        expires: accessToken.getExpires(),
                        baseDomain: baseDomain,
                    }
                );
            });
```

Отправить пользователя на страницу авторизации можно 2мя способами:
1. Отрисовав кнопку на сайт:
```typescript
apiClient.getOAuthClient().getOAuthButton(
            {
                title: 'Установить интеграцию',
                compact: true,
                class_name: 'className',
                color: 'default',
                error_callback: 'handleOauthError',
                state: state,
            }
        );
```

2. Отправив пользователя на страницу авторизации
```typescript
const authorizationUrl = apiClient.getOAuthClient().getAuthorizeUrl({
            state: state,
            mode: 'post_message', //post_message - редирект произойдет в открытом окне, popup - редирект произойдет в окне родителе
        });

// redirect to authorizationUrl
```

Для получения Access Token можно использовать следующий код в обработчике, который будет находиться по адресу, указанному в redirect_uri
```typescript
const accessToken = await apiClient.getOAuthClient().getAccessTokenByCode(code);
```

Пример авторизации можно посмотреть в файле examples/get_token.ts

### Авторизация с правами конкретного пользователя аккаунта
Начиная с версии 1.4.0 появилась возможность авторизоваться с правами конкретного пользователя, если токен был выпущен администратором аккаунта.

Для авторизации под пользователем аккаунта - необходимо задать ID пользователя у объекта типа ```AmoCRMApiClient```. Метод вернет новый объект с установленным контекстом.

```typescript
import { AmoCRMApiClient } from 'amocrm-api-library';

const apiClient = new AmoCRMApiClient(clientId, clientSecret, redirectUri);
const apiClientWithContext = apiClient.withContextUserId(123);
```

### Установка кастомного User Agent
Начиная с версии 1.5.0 появилась возможность указать свой User Agent для запросов с библиотекой.

```typescript
import { AmoCRMApiClient } from 'amocrm-api-library';

const apiClient = new AmoCRMApiClient(clientId, clientSecret, redirectUri);
apiClient.setUserAgnet('App Name');
```

### Установка кастомного callback-обработчика ответа от сервера
Начиная с версии 1.9.0 появилась возможность устанавливать callback-обработчик ответа от сервера.

Вы можете установить функцию-callback на событие обработки ответа, если есть необходимость в дополнительной логике (например логировать ответ от сервера или же переопределить обработку 204 кода ответа).

Если нет необходимости в отработке стандартной логики обработки ответа, то callback должен возвращать true

```typescript
import { AmoCRMApiClient } from 'amocrm-api-library';

const apiClient = new AmoCRMApiClient(clientId, clientSecret, redirectUri);

apiClient
     .setCheckHttpStatusCallback(
         async (response: Response, decodedBody: any) => {
             if (response.status === 204) {
                 return true;
             }

             this.logger.info('Response: ', decodedBody);
         }
     );
```


## Авторизация с долгоживущим токеном
Не так давно в amoCRM появилась возможность создавать долгоживущие токены. Их можно легко использовать с этой библиотекой.

Для начала использования вам необходимо создать объект библиотеки:
```typescript
import { AmoCRMApiClient } from 'amocrm-api-library';

const apiClient = new AmoCRMApiClient();
```

После этого нужно создать объект ```LongLivedAccessToken```, который будет использоваться с запросами в API.

```typescript
import { LongLivedAccessToken } from 'amocrm-api-library';

const longLivedAccessToken = new LongLivedAccessToken(accessToken);
```

Затем нужно установить токен и адресс аккаунта в объект библиотеки:
```typescript
apiClient.setAccessToken(longLivedAccessToken)
    .setAccountBaseDomain('example.amocrm.ru');
```

После этих простых шагов, вы сможете делать запросы в amoCRM до тех пор, пока токен не истечет или его не отзовут.
В случае отзыва или истечения токена - при выполнении запроса - упадет ошибка с http кодом 401.


## Подход к работе с библиотекой

В библиотеке используется сервисный подход. Для каждой сущности имеется сервис.
Для каждого метода имеется свой объект коллекции и модели.
Работа с данными происходит через коллекции и методы библиотеки.

Модели и коллекции имеют методы ```toArray()``` и ```toApi()```, методы возвращают представление объекта в виде массива и в виде данных, отправляемых в API.

Также для работы с коллекциями имеются следующие методы:

1. ```add(model: BaseApiModel): this``` - добавляет модель в конец коллекции.
2. ```prepend(model: BaseApiModel): this``` - добавляет модель в начало коллекции.
3. ```all(): T[]``` - возвращает массив моделей в коллекции.
4. ```first(): T | null``` - получение первой модели в коллекции.
5. ```last(): T | null``` - получение последней модели в коллекции.
6. ```count(): number``` - получение кол-ва элементов в коллекции.
7. ```isEmpty(): boolean``` - проверяет, что коллекция не пустая.
8. ```getBy(key: string, value: unknown): T | null``` - получение модели по значению ключа.
9. ```replaceBy(key: string, value: unknown, replacement: T): void``` - замена модели по значению ключа.
10. ```removeBy(key: string, value: unknown): number``` - удаление моделей по значению ключа, возвращает количество удаленных моделей.
11. ```removeFirstBy(key: string, value: unknown): boolean``` - удаление первой модели по значению ключа, возвращает true если модель была удалена.
12. ```chunk(size: number): this[]``` - разделение коллекции на массив состоящий из коллекций определенной длины.
13. ```pluck(column: string): Record<number, unknown>``` - получение массива значений моделей коллекции по названию свойства.

При работе с библиотекой необходимо не забывать о лимитах API amoCRM.
Для оптимальной работы с данными лучше всего создавать/изменять за раз не более 50 сущностей в методах, где есть пакетная обработка.

Нужно не забывать про обработку ошибок, а также не забывать о безопасности хранилища токенов. **Утечка токена грозит потерей доступа к аккаунту.**

## Поддерживаемые методы и сервисы

Библиотека поддерживает большое количество методов API. Методы сгруппированы в объекты-сервисы. Получить объект сервиса можно вызвав необходимый метод у библиотеки, например:
```typescript
const leadsService = apiClient.leads();
```

В данный момент доступны следующие сервисы:

| Сервис               | Цель сервиса                  |
|----------------------|-------------------------------|
| notes                | Примечание сущности           |
| tags                 | Теги сущностей                |
| tasks                | Задачи                        |
| leads                | Сделки                        |
| contacts             | Контакты                      |
| companies            | Компании                      |
| catalogs             | Каталоги                      |
| catalogElements      | Элементы каталогов            |
| customFields         | Пользовательские поля         |
| customFieldGroups    | Группы пользовательских полей |
| account              | Информация об аккаунте        |
| roles                | Роли пользователей            |
| users                | Роли юзеров                   |
| customersSegments    | Сегменты покупателей          |
| events               | Список событий                |
| eventTypes           | Типы событий                  |
| webhooks             | Вебхуки                       |
| unsorted             | Неразобранное                 |
| pipelines            | Воронки сделок                |
| statuses             | Статусы сделок                |
| widgets              | Виджеты                       |
| lossReason           | Причины отказа                |
| transactions         | Покупки покупателей           |
| customers            | Покупатели                    |
| customersStatuses    | Сегменты покупателя           |
| customersBonusPoints | Бонусные баллы покупателя     |
| calls                | Звонки                        |
| products             | Товары                        |
| links                | Массовая привязка сущностей   |
| shortLinks           | Короткие ссылки               |
| talks                | Беседы                        |
| sources              | Источники                     |
| chatTemplates        | Шаблоны чатов                 |
| entitySubscriptions  | Подписчики сущности           |
| getOAuthClient       | oAuth сервис                  |
| getRequest           | Голые запросы                 |
| files                | Файлы                         |
| entityFiles          | Связь файлов с сущностями     |
| websiteButtons       | Кнопка на сайт                |

#### Для большинства сервисов есть базовый набор методов:

1. getOne - Получить 1 сущность
    1. id (number | string) - id сущности
    2. withRelations (string[]) - массив параметров with, которые поддерживает модель сервиса
    3. Результатом выполнения будет модель сущности
    ```typescript
    async getOne(id: number | string, withRelations?: string[]): Promise<TModel | null>;
    ```

2. get Получить несколько сущностей:
    1. filter (BaseEntityFilter) - фильтр для сущности
    2. withRelations (string[]) - массив параметров with, которые поддерживает модель сервиса
    3. Результатом выполнения будет коллекция сущностей
    ```typescript
    async get(filter?: BaseEntityFilter | null, withRelations?: string[]): Promise<TCollection | null>;
    ```

3. addOne Создать одну сущность:
    1. model (BaseApiModel) - модель создаваемой сущности
    2. Результатом выполнения будет модель сущности
    ```typescript
    async addOne(model: BaseApiModel): Promise<TModel>;
    ```

4. add Создать сущности пакетно:
    1. collection (BaseApiCollection) - коллекция моделей создаваемой сущности
    2. Результатом выполнения будет коллекция моделей сущности
    ```typescript
    async add(collection: BaseApiCollection): Promise<TCollection>;
    ```

5. updateOne Обновить одну сущность:
    1. model (BaseApiModel) - модель создаваемой сущности
    2. Результатом выполнения будет модель сущности
    ```typescript
    async updateOne(model: BaseApiModel): Promise<TModel>;
    ```

6. update Обновить сущности пакетно:
    1. collection (BaseApiCollection) - коллекция моделей создаваемой сущности
    2. Результатом выполнения будет коллекция моделей сущности
    ```typescript
    async update(collection: BaseApiCollection): Promise<TCollection>;
    ```

7. syncOne Синхронизировать одну модель с сервером:
    1. model (BaseApiModel) - коллекция моделей создаваемой сущности
    2. withRelations (string[]) - массив параметров with, которые поддерживает модель сервиса
    3. Результатом выполнения будет коллекция моделей сущности
    ```typescript
    async syncOne(model: BaseApiModel, withRelations?: string[]): Promise<TModel>;
    ```

Не все методы доступны во всех сервисах. В случае их вызова будет выброшены Exception.

Некоторые сервисы имеют специфичные методы, ниже рассмотрим сервисы, которые имеют специфичные методы.

#### Методы доступные в сервисе ```leads```:
1. addComplex Создать сделки пакетно со связанным контакт и компанией через [комплексный метод](https://www.amocrm.ru/developers/content/crm_platform/leads-api#leads-complex-add) с поддержкой [контроля дублей](https://www.amocrm.ru/developers/content/crm_platform/duplication-control)
    1. collection (LeadsCollection) - коллекция моделей создаваемой сущности
    2. Результатом выполнения будет новая коллекция созданных сущностей
    ```typescript
    async addComplex(collection: LeadsCollection): Promise<LeadsCollection>;
    ```
2. addOneComplex Создать одну сделку со связанным контакт и компанией через [комплексный метод](https://www.amocrm.ru/developers/content/crm_platform/leads-api#leads-complex-add) с поддержкой [контроля дублей](https://www.amocrm.ru/developers/content/crm_platform/duplication-control)
    1. collection (LeadsCollection) - коллекция моделей создаваемой сущности
    2. Результатом выполнения будет новая модель созданной сделки
    ```typescript
    async addOneComplex(model: LeadModel): Promise<LeadModel>;
    ```

Подробнее про использование метода комплексного создания смотрите в [примере](examples/leads_complex_actions.ts)

#### Методы доступные в сервисе ```getOAuthClient```:
1. getAuthorizeUrl получение ссылки на авторизация
    1. options (object)
        1. state (string) состояние приложения
    2. Результатом выполнения будет строка со ссылкой на авторизация приложения
    ```typescript
    getAuthorizeUrl(options?: Record<string, string>): string;
    ```

2. getAccessTokenByCode получение access токена по коду авторизации
    1. code (string) код авторизации
    2. Результатом выполнения будет объект (AccessTokenInterface)
    ```typescript
    async getAccessTokenByCode(code: string): Promise<AccessTokenInterface>;
    ```

3. getAccessTokenByRefreshToken получение access токена по refresh токену
    1. accessToken (AccessTokenInterface) объект access токена
    2. Результатом выполнения будет объект (AccessTokenInterface)
    ```typescript
    async getAccessTokenByRefreshToken(accessToken: AccessTokenInterface): Promise<AccessTokenInterface>;
    ```

4. setBaseDomain установка базового домена, куда будут отправляться запросы необходимые для работы с токенами
    1. domain (string)
    ```typescript
    setBaseDomain(domain: string): void;
    ```

5. setAccessTokenRefreshCallback установка callback, который будет вызван при обновлении access токена
    1. callback (function)
    ```typescript
    setAccessTokenRefreshCallback(callback: Function): void;
    ```

6. getOAuthButton установка callback, который будет вызван при обновлении access токена
    1. options (object)
        1. state (string) состояние приложения
        2. color (string)
        3. title (string)
        4. compact (boolean)
        5. class_name (string)
        6. error_callback (string)
        7. mode (string)
    2. Результатом выполнения будет строка с HTML кодом кнопки авторизации
    ```typescript
    getOAuthButton(options?: Record<string, any>): string;
    ```

7. exchangeApiKey метод для обмена API ключа на код авторизации
    1. login - email пользователя, для которого обменивается API ключ
    2. apiKey - API ключ пользователя
    3. Код авторизации будет прислан на указанный в настройках приложения redirect_uri
    ```typescript
    async exchangeApiKey(login: string, apiKey: string): Promise<void>;
    ```

#### Методы связей доступны в сервисах ```leads```, ```contacts```, ```companies```, ```customers```:

1. link Привязать сущность
    1. model (BaseApiModel) - модель главной сущности
    2. links (LinksCollection | LinkModel) - коллекция или модель связи
    3. Результатом выполнения является коллекция связей (LinksCollection)
    ```typescript
    async link(model: BaseApiModel, linkedEntities: LinksCollection | LinkModel): Promise<LinksCollection>;
    ```

2. getLinks Получить связи сущности
    1. model (BaseApiModel) - модель главной сущности
    2. filter (LinksFilter) - фильтр для связей
    3. Результатом выполнения является коллекция связей (LinksCollection)
    ```typescript
    async getLinks(model: BaseApiModel, filter: LinksFilter): Promise<LinksCollection>;
    ```

3. unlink Отвязать сущность
    1. model (BaseApiModel) - модель главной сущности
    2. links (LinksCollection | LinkModel) - коллекция или модель связи
    3. Результатом выполнения является bool значение
    ```typescript
    async unlink(model: BaseApiModel, linkedEntities: LinksCollection | LinkModel): Promise<boolean>;
    ```

#### Методы удаления доступны в сервисах ```transactions```, ```lossReasons```, ```statuses```, ```pipelines```, ```customFields```, ```customFieldsGroups```, ```roles```, ```customersStatuses```, ```entityFiles```, ```files```:

1. delete
    1. model (BaseApiModel) - модель сущности
    2. Результатом выполнения является bool значение
    ```typescript
    async deleteOne(model: BaseApiModel): Promise<boolean>;
    ```

2. deleteOne
    1. collection (BaseApiCollection) - коллекция моделей сущностей
    2. Результатом выполнения является bool значение
    ```typescript
    async deleteOne(model: BaseApiModel): Promise<boolean>;
    ```

#### Методы доступные в сервисе ```customers```:
1. setMode Смена режима покупателей (периодические покупки или сегментация). Если покупатели выключены - то они будут включены.
    1. mode (string) - тип режима (periodicity или segments)
    2. isEnabled (boolean) - включен ли функционал покупателей, по-умолчанию - true
    3. Результатом выполнения является строка названия включенного режима или null в случае отключения функционала
    ```typescript
    async setMode(mode: string, isEnabled: boolean = true): Promise<string | null>;
    ```

#### Методы доступные в сервисе ```customersBonusPoints```:
1. earnPoints Начисляет бонусные баллы покупателю
    1. model (BonusPointsActionModel) - модель в которой Id покупателя и количество баллов для начисления
    2. Результатом выполнения является обновленное количество бонусных баллов покупателя или null в случае если произошла ошибка
    ```typescript
    async earnPoints(bonusPointsActionModel: BonusPointsActionModel): Promise<number | null>;
    ```

2. redeemPoints Списывает бонусные баллы покупателя
    1. model (BonusPointsActionModel) - модель в которой Id покупателя и количество баллов для списания
    2. Результатом выполнения является обновленное количество бонусных баллов покупателя или null в случае если произошла ошибка
    ```typescript
    async redeemPoints(bonusPointsActionModel: BonusPointsActionModel): Promise<number | null>;
    ```

#### Методы доступные в сервисе ```notes```, ```entitySubscriptions```:
1. getByParentId Получение данных по ID родительской сущности
    1. parentId - ID родительской сущности
    2. filter (BaseEntityFilter) - фильтр
    3. withRelations (string[]) - массив параметров with, которые поддерживает модель сервиса
    ```typescript
    async getByParentId(parentId: number, filter?: BaseEntityFilter | null, withRelations?: string[]): Promise<TCollection | null>;
    ```

#### Методы доступные в сервисе ```account```
1. getCurrent
    1. withRelations (string[]) - массив параметров with, которые поддерживает модель сервиса
    2. Результатом выполнения является модель AccountModel
    ```typescript
    async getCurrent(withRelations?: string[]): Promise<AccountModel>;
    ```

#### Методы доступные в сервисе ```unsorted```
1. addOne Создать одну сущность:
    1. model (BaseApiModel) - модель создаваемой сущности
    2. Результатом выполнения будет модель сущности
    ```typescript
    async addOne(model: BaseApiModel): Promise<TModel>;
    ```

2. add Создать сущности пакетно:
    1. collection (BaseApiCollection) - коллекция моделей создаваемой сущности
    2. Результатом выполнения будет коллекция моделей сущности
    ```typescript
    async add(collection: BaseApiCollection): Promise<TCollection>;
    ```

3. link
    1. model (BaseApiModel) - модель неразобранного
    2. body (object) - массив дополнительной информации для привязки
    3. Результатом выполнения будет модель LinkUnsortedModel
    ```typescript
    async link(unsortedModel: BaseApiModel, body?: Record<string, any>): Promise<LinkUnsortedModel>;
    ```

4. accept
    1. model (BaseApiModel) - модель неразобранного
    2. body (object) - массив дополнительной информации для принятия
    3. Результатом выполнения будет модель AcceptUnsortedModel
    ```typescript
    async accept(unsortedModel: BaseApiModel, body?: Record<string, any>): Promise<AcceptUnsortedModel>;
    ```

5. decline
    1. model (BaseApiModel) - модель неразобранного
    2. body (object) - массив дополнительной информации для отклонения
    3. Результатом выполнения будет модель DeclineUnsortedModel
    ```typescript
    async decline(unsortedModel: BaseApiModel, body?: Record<string, any>): Promise<DeclineUnsortedModel>;
    ```

6. summary
    1. filter (BaseEntityFilter) - фильтр для сущности
    2. Результатом выполнения будет модель UnsortedSummaryModel
    ```typescript
    async summary(filter: BaseEntityFilter): Promise<UnsortedSummaryModel>;
    ```

#### Методы доступные в сервисе ```webhooks```
1. subscribe
    1. model (WebhookModel) - модель вебхука
    2. Результатом выполнения является модель WebhookModel
    ```typescript
    async subscribe(webhookModel: WebhookModel): Promise<WebhookModel>;
    ```

2. unsubscribe
    1. model (WebhookModel) - модель вебхука
    2. Результатом выполнения является bool значение
    ```typescript
    async unsubscribe(webhookModel: WebhookModel): Promise<boolean>;
    ```

#### Методы доступные в сервисе ```widgets```
1. install
    1. model (WidgetModel) - модель виджета
    2. Результатом выполнения является модель WidgetModel
    ```typescript
    async install(widgetModel: WidgetModel): Promise<WidgetModel>;
    ```

2. uninstall
    1. model (WidgetModel) - модель виджета
    2. Результатом выполнения является модель WidgetModel
    ```typescript
    async uninstall(widgetModel: WidgetModel): Promise<WidgetModel>;
    ```

#### Методы доступные в сервисе ```products```
1. settings
    1. Результатом выполнения является модель ProductsSettingsModel
    ```typescript
    async settings(): Promise<ProductsSettingsModel>;
    ```

2. updateSettings
    1. model (ProductsSettingsModel) - модель виджета
    2. Результатом выполнения является модель ProductsSettingsModel
    ```typescript
    async updateSettings(productsSettings: ProductsSettingsModel): Promise<ProductsSettingsModel>;
    ```

#### Методы, доступные в сервисе ```talks```
1. close
   1. model (TalkCloseActionModel) - модель для закрытия беседы
   2. Результатом выполнения - является закрытие беседы или запуск NPS-бота для последующего закрытия беседы
    ```typescript
    async close(closeAction: TalkCloseActionModel): Promise<void>;
    ```

#### Методы, доступные в сервисе ```files```
1. uploadOne
   1. model (FileUploadModel) - модель файла для загрузки
   2. Результатом выполнения является модель FileModel
    ```typescript
    async uploadOne(model: FileUploadModel): Promise<FileModel>;
    ```

#### Методы, доступные в сервисе ```websiteButtons```
1. getOne - получить 1 сущность:
   1. id (number | string) - id источника
   2. withRelations (string[]) - массив параметров with, которые поддерживает модель сервиса
   3. Результатом выполнения будет модель сущности ```WebsiteButtonModel```
    ```typescript
    async getOne(id: number | string, withRelations?: string[]): Promise<WebsiteButtonModel | null>;
    ```
2. get - получить несколько сущностей:
   1. filter (BaseEntityFilter) - фильтр для сущности
   2. withRelations (string[]) - массив параметров with, которые поддерживает модель сервиса
   3. Результатом выполнения будет коллекция ```WebsiteButtonsCollection``` из сущностей ```WebsiteButtonModel```
    ```typescript
    async get(filter?: BaseEntityFilter | null, withRelations?: string[]): Promise<WebsiteButtonsCollection | null>;
    ```
3. createAsync - добавить источник типа "кнопка на сайт"
   1. model (WebsiteButtonCreateRequestModel) - модель со свойствами:
      1. pipelineId (number) - id воронки
      2. trustedWebsites (string[]) - список доверенных адресов на которых будет размещена "кнопка на сайт". Например amocrm.ru, https://amocrm.ru
      3. isUsedInApp (true | false) - true, если кнопка встраивается в приложение, а не на сайт
   2. Результатом выполнения будет модель ```WebsiteButtonCreateResponseModel```
    ```typescript
    async createAsync(model: WebsiteButtonCreateRequestModel): Promise<WebsiteButtonCreateResponseModel>;
    ```
4. updateAsync - добавить дополнительные доверенные адреса
   1. model (WebsiteButtonUpdateRequestModel) - модель со свойствами:
      1. sourceId (number) - id источника
      2. trustedWebsitesToAdd (string[]) - список доверенных адресов на которых будет размещена "кнопка на сайт"
   2. Результатом выполнения будет модель ```WebsiteButtonModel```
    ```typescript
    async updateAsync(model: WebsiteButtonUpdateRequestModel): Promise<WebsiteButtonModel>;
    ```
5. addOnlineChatAsync - добавить канал связи "Онлайн-чат" к кнопке на сайт
   1. sourceId - id источника
   2. Результатом выполнения будет void значение
    ```typescript
    async addOnlineChatAsync(sourceId: number): Promise<void>;
    ```


## Обработка ошибок

Вызов методов библиотеки может выбрасывать ошибки типа ```AmoCRMApiException```.
В данные момент доступны следующие типы ошибок, они все наследуют AmoCRMApiException:

| Тип                                    | Условия                                                                                                |
|----------------------------------------|--------------------------------------------------------------------------------------------------------|
| AmoCRMApiConnectException              | Подключение к серверу не было выполнено                                                                |
| AmoCRMApiErrorResponseException        | Сервер вернул ошибку на выполняемый запрос                                                             |
| AmoCRMApiHttpClientException           | Произошла ошибка http клиента                                                                          |
| AmoCRMApiNoContentException            | Сервер вернул код 204 без результата, ничего страшного не произошло, просто нет данных на ваш запрос   |
| AmoCRMApiTooManyRedirectsException     | Слишком много редиректов (в нормальном режиме не выкидывается)                                         |
| AmoCRMoAuthApiException                | Ошибка в oAuth клиенте                                                                                 |
| BadTypeException                       | Передан неверный тип данных                                                                            |
| InvalidArgumentException               | Передан неверный аргумент                                                                              |
| NotAvailableForActionException         | Метод не доступен для вызова                                                                           |
| AmoCRMApiPageNotAvailableException     | Выбрасывается в случае запроса следующей или предыдущей страницы коллекции, когда страница отсутствует |
| AmoCRMMissedTokenException             | Не установлен Access Token для выполнения запроса                                                      |

У выброшенных Exception есть следующие методы:
1. ```getErrorCode()```
2. ```getTitle()```
3. ```getLastRequestInfo()```
4. ```getDescription()```

У ошибки типа AmoCRMApiErrorResponseException есть метод ```getValidationErrors()```, который вернет ошибки валидации входных данных.

## Фильтры

В данный момент библиотека поддерживает фильтры для следующих сервисов:

| Сервис                                                        | Фильтр                        | Особенности                                                                                        | Поддерживает ли сортировку? |
|---------------------------------------------------------------|-------------------------------|----------------------------------------------------------------------------------------------------|-----------------------------|
| ```catalogElements```                                         | ```CatalogElementsFilter```   | Доступен в ограниченном виде, в будущих версиях будет расширен                                     | ❌                           |
| ```companies```                                               | ```CompaniesFilter```         | Доступен только на аккаунтах, которые подключены к тестированию функционала фильтрации по API      | ✅                           |
| ```contacts```                                                | ```ContactsFilter```          | Доступен только на аккаунтах, которые подключены к тестированию функционала фильтрации по API      | ✅                           |
| ```customers```                                               | ```CustomersFilter```         | Доступен только на аккаунтах, которые подключены к тестированию функционала фильтрации по API      | ✅                           |
| ```customFields```                                            | ```CustomFieldsFilter```      | Фильтр для метода получения дополнительных полей `CustomFieldsService.get()`                       | ❌                           |
| ```leads```                                                   | ```LeadsFilter```             | Доступен только на аккаунтах, которые подключены к тестированию функционала фильтрации по API      | ✅                           |
| ```events```                                                  | ```EventsFilter```            | Фильтр для списка событий                                                                          | ❌                           |
| ```leads```, ```contacts```, ```customers```, ```companies``` | ```LinksFilter```             | Фильтр для получения связей для метода `HasLinkMethodInterface.getLinks()`                         | ❌                           |
| ```notes```                                                   | ```NotesFilter```             | Фильтра для `EntityNotesService.get()`                                                             | ✅                           |
| ```tags```                                                    | ```TagsFilter```              | Фильтр для `EntityTagsService.get()`                                                               | ❌                           |
| ```tasks```                                                   | ```TasksFilter```             | Фильтр для метода `TasksService.get()`                                                             | ✅                           |
| ```unsorted```                                                | ```UnsortedFilter```          | Фильтр для метода `UnsortedService.get()`                                                          | ✅                           |
| ```unsorted```                                                | ```UnsortedSummaryFilter```   | Фильтр для метода `UnsortedService.summary()`                                                      | ❌                           |
| ```webhooks```                                                | ```WebhooksFilter```          | Фильтр для метода получения хуков                                                                  | ❌                           |
| ```files```                                                   | ```FilesFilter```             | Фильтр для метода получения файлов `FilesService.get()`                                            | ❌                           |
| ```sources```                                                 | ```SourcesFilter```           | Фильтр для метода получения источников `SourcesService.get()`                                      | ❌                           |
| ```chatTemplates```                                           | ```TemplatesFilter```         | Фильтр для метода получения шаблонов чатов `TemplatesService.get()`                                | ❌                           |
| Сервисы, где необходима постраничная навигация                | ```PagesFilter```             | Фильтр, который подходит для любого сервиса, где есть постраничная навигация                       | ❌                           |


## Работа с дополнительными полями сущностей

Дополнительные поля доступны у сущностей следующих сервисов:
1. ```leads```
2. ```contacts```
3. ```companies```
4. ```customers```
5. ```catalogElements```
6. ```segments```

У моделей, которые возвращаются этими сервисами, поля можно получить через метод ```getCustomFieldsValues()```.
На вызов данного метода возвращается объект ```CustomFieldsValuesCollection``` или ```null```,
если значений полей нет.

Внутри коллекции ```CustomFieldsValuesCollection``` находятся модели значений полей,
все модели наследуются от ```BaseCustomFieldValuesModel```, но зависят от типа поля.

У моделей, наследующих ```BaseCustomFieldValuesModel``` доступны следующие методы:
1. ```getFieldId```, ```setFieldId``` - получение/установка id поля
2. ```getFieldType``` - получение типа поля
3. ```getFieldCode```, ```setFieldCode``` - получение/установка кода поля
4. ```getFieldName```, ```setFieldName``` - получение/установка названия поля
5. ```getValues```, ```setValues``` - получение/установка коллекции значений

Так как некоторые поля могут иметь несколько значений,
в свойстве values хранится именно коллекция значений типа ```BaseCustomFieldValueCollection```.
Моделями коллекции являются модели типа ```BaseCustomFieldValueModel```.

#### Схема отношений объектов:

```CustomFieldsValuesCollection 1 <---> n BaseCustomFieldValuesModel```

```BaseCustomFieldValuesModel::getValues() 1 <---> 1 BaseCustomFieldValueCollection```

```BaseCustomFieldValueCollection 1 <---> n BaseCustomFieldValueModel```

#### Для разных типов полей мы уже подготовили разные модели и коллекции:

Value models находятся в модуле значений.

Коллекции моделей значений находятся в модуле коллекций значений.

Модели дополнительных полей находятся в модуле CustomFieldsValues.

| Тип поля                 | Модель значения                    | Коллекция моделей значений              | Модель доп поля                     | Контакт | Сделка | Компания | Покупатель |         Каталог          | Сегмент |
|--------------------------|------------------------------------|-----------------------------------------|-------------------------------------|:-------:|:------:|:--------:|:----------:|:------------------------:|:-------:|
| Текст                    | TextCustomFieldValueModel          | TextCustomFieldValueCollection          | TextCustomFieldValuesModel          |    ✅    |   ✅    |    ✅     |     ✅      |            ✅             |    ✅    |
| Число                    | NumericCustomFieldValueModel       | NumericCustomFieldValueCollection       | NumericCustomFieldValuesModel       |    ✅    |   ✅    |    ✅     |     ✅      |            ✅             |    ✅    |
| Флаг                     | CheckboxCustomFieldValueModel      | CheckboxCustomFieldValueCollection      | CheckboxCustomFieldValuesModel      |    ✅    |   ✅    |    ✅     |     ✅      |            ✅             |    ✅    |
| Список                   | SelectCustomFieldValueModel        | SelectCustomFieldValueCollection        | SelectCustomFieldValuesModel        |    ✅    |   ✅    |    ✅     |     ✅      |            ✅             |    ✅    |
| Мультисписок             | MultiselectCustomFieldValueModel   | MultiselectCustomFieldValueCollection   | MultiSelectCustomFieldValuesModel   |    ✅    |   ✅    |    ✅     |     ✅      |            ✅             |    ✅    |
| Мультитекст              | MultitextCustomFieldValueModel     | MultitextCustomFieldValueCollection     | MultitextCustomFieldValuesModel     |    ✅    |   ❌    |    ❌     |     ❌      |            ❌             |    ❌    |
| Дата                     | DateCustomFieldValueModel          | DateCustomFieldValueCollection          | DateCustomFieldValuesModel          |    ✅    |   ✅    |    ✅     |     ✅      |            ✅             |    ✅    |
| Ссылка                   | UrlCustomFieldValueModel           | UrlCustomFieldValueCollection           | UrlCustomFieldValuesModel           |    ✅    |   ✅    |    ✅     |     ✅      |            ✅             |    ✅    |
| Дата и время             | DateTimeCustomFieldValueModel      | DateTimeCustomFieldValueCollection      | DateTimeCustomFieldValuesModel      |    ✅    |   ✅    |    ✅     |     ✅      |            ✅             |    ✅    |
| Текстовая область        | TextareaCustomFieldValueModel      | TextareaCustomFieldValueCollection      | TextareaCustomFieldValuesModel      |    ✅    |   ✅    |    ✅     |     ✅      |            ✅             |    ✅    |
| Переключатель            | RadiobuttonCustomFieldValueModel   | RadiobuttonCustomFieldValueCollection   | RadiobuttonCustomFieldValuesModel   |    ✅    |   ✅    |    ✅     |     ✅      |            ✅             |    ✅    |
| Короткий адрес           | StreetAddressCustomFieldValueModel | StreetAddressCustomFieldValueCollection | StreetAddressCustomFieldValuesModel |    ✅    |   ✅    |    ✅     |     ✅      |            ✅             |    ✅    |
| Адрес                    | SmartAddressCustomFieldValueModel  | SmartAddressCustomFieldValueCollection  | SmartAddressCustomFieldValuesModel  |    ✅    |   ✅    |    ✅     |     ❌      |            ❌             |    ❌    |
| День рождения            | BirthdayCustomFieldValueModel      | BirthdayCustomFieldValueCollection      | BirthdayCustomFieldValuesModel      |    ✅    |   ✅    |    ✅     |     ❌      |            ❌             |    ❌    |
| Юр. лицо                 | LegalEntityCustomFieldValueModel   | LegalEntityCustomFieldValueCollection   | LegalEntityCustomFieldValuesModel   |    ✅    |   ✅    |    ✅     |     ❌      |            ❌             |    ❌    |
| Цена                     | PriceCustomFieldValueModel         | PriceCustomFieldValueCollection         | PriceCustomFieldValuesModel         |    ❌    |   ❌    |    ❌     |     ❌      |            ✅             |    ❌    |
| Категория                | CategoryCustomFieldValueModel      | CategoryCustomFieldValueCollection      | CategoryCustomFieldValuesModel      |    ❌    |   ❌    |    ❌     |     ❌      |            ✅             |    ❌    |
| Предметы                 | ItemsCustomFieldValueModel         | ItemsCustomFieldValueCollection         | ItemsCustomFieldValuesModel         |    ❌    |   ❌    |    ❌     |     ❌      |            ✅             |    ❌    |
| Метка                    | TrackingDataCustomFieldValueModel  | TrackingDataCustomFieldValueCollection  | TrackingDataCustomFieldValuesModel  |    ❌    |   ✅    |    ❌     |     ❌      |            ❌             |    ❌    |
| Связь с другим элементом | LinkedEntityCustomFieldValueModel  | LinkedEntityCustomFieldValueCollection  | LinkedEntityCustomFieldValuesModel  |    ❌    |   ❌    |    ❌     |     ❌      |            ✅             |    ❌    |
| Денежное                 | MonetaryCustomFieldModel           | MonetaryCustomFieldValueCollection      | MonetaryCustomFieldValuesModel      |    ✅    |   ✅    |    ✅     |     ✅      |            ❌             |    ❌    |
| Каталоги и списки        | ChainedListCustomFieldModel        | ChainedListCustomFieldValueCollection   | ChainedListCustomFieldValuesModel   |    ❌    |   ✅    |    ❌     |     ✅      |            ❌             |    ❌    |
| Файл                     | FileCustomFieldModel               | FileCustomFieldValueCollection          | FileCustomFieldValuesModel          |    ✅    |   ✅    |    ✅     |     ✅      |            ❌             |    ❌    |
| Плательщик               | PayerCustomFieldModel              | PayerCustomFieldValueCollection         | PayerCustomFieldValuesModel         |    ❌    |   ❌    |    ❌     |     ❌      | ✅ (только счета-покупки) |    ❌    |
| Поставщик                | SupplierCustomFieldModel           | SupplierCustomFieldValueCollection      | SupplierCustomFieldValuesModel      |    ❌    |   ❌    |    ❌     |     ❌      | ✅ (только счета-покупки) |    ❌    |

Пример кода, как создать коллекцию значения полей сущности:
```typescript
import {
    LeadModel,
    CustomFieldsValuesCollection,
    TextCustomFieldValuesModel,
    TextCustomFieldValueCollection,
    TextCustomFieldValueModel,
} from 'amocrm-api-library';

//Создадим модель сущности
const lead = new LeadModel();
lead.setId(1);
//Создадим коллекцию полей сущности
const leadCustomFieldsValues = new CustomFieldsValuesCollection();
//Создадим модель значений поля типа текст
const textCustomFieldValuesModel = new TextCustomFieldValuesModel();
//Укажем ID поля
textCustomFieldValuesModel.setFieldId(123);
//Добавим значения
textCustomFieldValuesModel.setValues(
    (new TextCustomFieldValueCollection())
        .add((new TextCustomFieldValueModel()).setValue('Текст'))
);
//Добавим значение в коллекцию полей сущности
leadCustomFieldsValues.add(textCustomFieldValuesModel);
//Установим в сущности эти поля
lead.setCustomFieldsValues(leadCustomFieldsValues);
```

Чтобы удалить значения поля доступен специальный объект ```NullCustomFieldValueCollection```.

Передав этот объект, вы зануляете значение поля.

Пример:
```typescript
import {
    LeadModel,
    CustomFieldsValuesCollection,
    TextCustomFieldValuesModel,
    NullCustomFieldValueCollection,
} from 'amocrm-api-library';

//Создадим модель сущности
const lead = new LeadModel();
lead.setId(1);
//Создадим коллекцию полей сущности
const leadCustomFieldsValues = new CustomFieldsValuesCollection();
//Создадим модель значений поля типа текст
const textCustomFieldValuesModel = new TextCustomFieldValuesModel();
//Укажем ID поля
textCustomFieldValuesModel.setFieldId(123);
//Обнулим значения
textCustomFieldValuesModel.setValues(
    (new NullCustomFieldValueCollection())
);
//Добавим значение в коллекцию полей сущности
leadCustomFieldsValues.add(textCustomFieldValuesModel);
//Установим сущности эти поля
lead.setCustomFieldsValues(leadCustomFieldsValues);
```

## Работа с тегами сущностей

Теги доступны как отдельный сервис ```tags```.
При создании данного сервиса, вы указываете тип сущности, с тегами которой вы будете работать.

В данный момент доступны:
1. EntityTypes.LEADS,
2. EntityTypes.CONTACTS,
3. EntityTypes.COMPANIES,
4. EntityTypes.CUSTOMERS,

Для работы с тегами конкретной сущности, нужно взаимодействовать с конкретной моделью сущности.
С помощью методов ```getTags``` и ```setTags``` вы можете получить коллекцию тегов сущности или установить её.

Для изменения тегов вам необходимо передавать всю коллекцию тегов, иначе теги могут быть потеряны.

Пример добавления/изменения тегов у сущности:
```typescript
import {
    LeadModel,
    TagsCollection,
    TagModel,
} from 'amocrm-api-library';

//Создадим модель сущности
const lead = new LeadModel();
lead.setId(1);
//Создадим коллекцию тегов с тегами и установим их в сущности
lead.setTags((new TagsCollection())
    .add(
        (new TagModel())
            .setName('тег')
    ).add(
        (new TagModel())
            .setId(123123)
    )
);
```

или

```typescript
import {
    LeadModel,
    TagsCollection,
} from 'amocrm-api-library';

//Создадим модель сущности
const lead = new LeadModel();
lead.setId(1);
//Создадим коллекцию тегов с тегами и установим их в сущности
lead.setTags(
    TagsCollection.fromArray([
        {
            name: 'тег',
        },
        {
            id: 123,
        },
    ])
);
```

Для удаления тегов в setTags можно передать в ```setTags``` специальный объект ```NullTagsCollection```.

Пример удаления тегов у сущности:
```typescript
import { LeadModel, NullTagsCollection } from 'amocrm-api-library';

//Создадим модель сущности
const lead = new LeadModel();
lead.setId(1);
//Удалим теги
lead.setTags((new NullTagsCollection()));
```

## Особенности работы с источниками

На данный момент источники созданные интеграциями учитываются только при создании неразобранного из чатов.

При добавлении источника обязательными полями являются `external_id`, `name` интеграция может создать в аккаунте
не более 50 активных источников на аккаунт. При удалении источника, к примеру, со значением `external_id: 'sales'`
и при повторном создании с тем же `external_id` crm может вернуть `id` раннее удаленного источника. Поэтому не стоит
на стороне интеграции формировать первичный ключ из поля `id`.

Чтобы источник отображался в кнопке whatsapp CRM Plugin необходимо указать поле источника `services` с таким содержимым:
```json
 [
   {
      "type": "whatsapp",
      "pages": [
         {
            "id": "<идентификатор или номер телефона>",
            "name": "My WhatsApp",
            "link": "<номер телефона>"
         }
      ]
   }
]

```
Чтобы правильно сформировать поле `services` можно воспользоваться моделью ```SourceServicesCollection```

### Источник по-умолчанию

Источник по-умолчанию (с полем `default=true`) может быть только один или отсутствовать совсем. При отсутствии источника
по-умолчанию в сделках будет указан источник АПИ-интеграция с названием интеграции (как при создании неразобранного через АПИ).

Чтобы сменить источник по-умолчанию, достаточно нужному источнику проставить поле `default=true`, у предыдущего источника
поле default будет выставлено в `default=false`. Но при удалении источника по-умолчанию интеграция сама должна указать
новый источник по-умолчанию.

### Миграция интеграции на множественные источники (для интеграций с чатами)

Источник по-умолчанию может быть использован интеграцией при переходе на множественные источники, особенно если
интеграция поддерживает опцию написать первым.

К примеру исходное состояние:
   Есть аккаунт с подключенной интеграцией с чатами, эта интеграция поддерживает только 1 источник.
   На данный момент нам не важно как была установлена интеграция: через DP или маркетплейс.

Интеграция начинает внедрение поддержки множественных источников, логически разобьем на этапы:

**1 этап**
Интеграция умеет работать с АПИ источниками (но не отправляет и не принимает источник в сообщениях amojo).
Добавляет источник по-умолчанию, который логически соответствует источнику, использовавшемуся когда не было поддержки нескольких источников. Теперь crm будет присылать в сообщениях `external_id` этого источника для всех чатов которые явно
не закреплены за конкретным источником.

**2 этап**
Интеграция умеет работать с источниками и при отправке сообщений от клиента (при создании чата) указывает `external_id`
Все чаты с новыми сообщениями становятся размеченными по источнику.

Так же интеграция теперь обрабатывает источник и учитывает его при отправке сообщения от менеджера, в том числе при начале чата с клиентом (опция "написать первым").

**3 этап**
Интеграция позволяет администратору аккаунта добавить (через интеграцию) второй и последующие источники.
Вся переписка числится за каким-то источником

**Важный момент**
Источник по-умолчанию не привязывается к чатам, если его явно не передавали с сообщениями и тогда при смене
источника по-умолчанию чат без разметки будет "числиться" за новым источником

## Константы

Основные константы находятся в интерфейсе ```EntityTypes```.

Также доступны константы в следующих классах/интерфейсах:
1. ```BUTTON_COLORS``` - доступные цвета для кнопки на сайт
2. ```BaseUnsortedModel``` - константы для кодов категорий неразобранного
3. ```BirthdayCustomFieldModel``` - константы для свойства remind у поля День Рождения
4. ```CallInterface``` - константы статусов звонков
5. ```HasParentEntity``` - константы для ключей в запросах методов, у которых есть родительский сущность (в данный момент только notes)
6. ```ItemsCustomFieldValueModel``` - константы для ключей значения поля Items
7. ```RightModel``` - константы, связанные с правами
8. ```AccountModel``` - константы для аргумента with для сервиса ```account```
9. ```TaskModel``` - константы для дефолтных типов задач
10. ```TargetingNote``` - константы поддерживаемых внешних сервисов для примечаний о таргетинге (добавляют DP)
11. ```RoleModel``` - константы для аргумента with для сервиса ```roles```
12. ```NoteFactory``` - константы типов примечаний
13. ```MessageCashierNote``` - статусы примечания "Сообщение кассиру"
14. ```LeadModel``` - константы для аргумента with для сервиса ```leads```
15. ```HasOrderInterface``` - константы для сортировки
16. ```EventModel``` - константы для аргумента with для сервиса ```events```
17. ```CustomFieldModel``` - константы типов полей
18. ```CustomerModel``` - константы для аргумента with для сервиса ```customers```
19. ```ContactModel``` - константы для аргумента with для сервиса ```contacts```
20. ```CompanyModel``` - константы для аргумента with для сервиса ```companies```
21. ```CatalogElementModel``` - константы для аргумента with для сервиса ```catalogElements```
22. ```InvoicesCustomFieldsEnums``` - константы для работы с полями каталога счетов (с версии 0.12 константы статусов переехали в ```BillStatusEnumCode```)
23. ```ButtonsEnums``` - типы кнопок шаблонов чатов
24. ```SourceServiceTypeEnum``` - типы сервисов для источников
25. ```TagColorsEnum``` - возможные цвета для тегов
26. ```BillStatusEnumCode``` - предустановленные статусы для Счетов/Покупок
27. ```SuppliersCustomFieldsEnums``` - константы для свойств поля поставщик

## Работа в случае смены субдомена аккаунта

```typescript
import { AmoCRMApiClient, AccountDomainModel } from 'amocrm-api-library';

/**
 * Получим модель с информацией о домене аккаунта по access_token
 * Подробнее: @see AccountDomainModel
 *
 * Запрос уходит на www.amocrm.ru/oauth2/account/subdomain
 * С Authorization: Bearer {access_token}
 * curl 'https://www.amocrm.ru/oauth2/account/subdomain' -H 'Authorization: Bearer {access_token}'
 *
 * @example examples/get_account_subdomain.ts
 */
const accountDomain: AccountDomainModel = await apiClient.getOAuthClient()
        .getAccountDomain(accessToken);

// Возьмём из полученной модели текущий subdomain аккаунта и засетим наш апи клиент
apiClient.setAccountBaseDomain(accountDomain.getSubdomain());
// ... дальше продолжаем работу с апи клиентом
```

## Одноразовые токены интеграций, расшифровка

```typescript
import {
    AmoCRMApiClient,
    DisposableTokenModel,
    DisposableTokenExpiredException,
    DisposableTokenInvalidDestinationException,
    DisposableTokenVerificationFailedException,
} from 'amocrm-api-library';

// Как пример, получим заголовки с реквеста
// И получим нужный нам X-Auth-Token
const token = req.headers['x-auth-token'];

try {
    /**
     * Одноразовый токен для интеграций, для того чтобы его получить используйте
     * метод this.$authorizedAjax() в своей интеграции
     * Подробнее: @link https://www.amocrm.ru/developers/content/web_sdk/mechanics
     *
     * Данный токен должен передаваться в заголовках вместе с запросом на ваш удаленный сервер
     * X-Auth-Token: {disposable_token}
     * Время жизни токена: 30 минут
     *
     * Расшифруем пришедший токен и получим модель с информацией
     * Подробнее: @see DisposableTokenModel
     */
    const disposableTokenModel = await apiClient.getOAuthClient()
        .parseDisposableToken(token);

    console.log(disposableTokenModel.toArray());
} catch (e) {
    if (e instanceof DisposableTokenExpiredException) {
        // Время жизни токена истекло
        printError(e);
        process.exit(1);
    } else if (e instanceof DisposableTokenInvalidDestinationException) {
        // Не прошёл проверку на адресата токена
        printError(e);
        process.exit(1);
    } else if (e instanceof DisposableTokenVerificationFailedException) {
        // Токен не прошел проверку подписи
        printError(e);
        process.exit(1);
    }
}
```
Также вы можете распарсить и модель одноразового токена для Salesbot/Marketingbot.
Для этого необходимо сделать вызов метода `parseBotDisposableToken`:

```typescript
import {
    AmoCRMApiClient,
    BotDisposableTokenModel,
    DisposableTokenExpiredException,
    DisposableTokenInvalidDestinationException,
    DisposableTokenVerificationFailedException,
} from 'amocrm-api-library';

const token = 'XXX';

try {
    /**
     * Одноразовый токен для ботов, его вы можете получить, сделав вызов widget_request в виджете в боте
     * Подробнее: @link https://www.amocrm.ru/developers/content/digital_pipeline/salesbot#handler-widget_request
     *
     * Данный токен содержит в себе информацию об аккаунте и о сущности, с которой работает бот
     * Для продолжения бота необходимо сделать запрос на метод, который был получен в теле хука
     * Подробнее: @link https://www.amocrm.ru/developers/content/crm_platform/widgets-api#widget-continue
     *
     * Расшифруем пришедший токен и получим модель с информацией
     * Подробнее: @see BotDisposableTokenModel
     */
    const botDisposableTokenModel = await apiClient.getOAuthClient()
        .parseBotDisposableToken(token);

    console.log(botDisposableTokenModel.toArray());
} catch (e) {
    if (e instanceof DisposableTokenExpiredException) {
        // Время жизни токена истекло
        printError(e);
        process.exit(1);
    } else if (e instanceof DisposableTokenInvalidDestinationException) {
        // Не прошёл проверку на адресата токена
        printError(e);
        process.exit(1);
    } else if (e instanceof DisposableTokenVerificationFailedException) {
        // Токен не прошел проверку подписи
        printError(e);
        process.exit(1);
    }
}
```

## Работа с валютами

```typescript
import {
    AmoCRMApiClient,
    AmoCRMApiException,
    CurrenciesFilter,
} from 'amocrm-api-library';

/** apiClient: AmoCRMApiClient */

// Получим сервис для работы с валютами
const service = apiClient.currencies();

// Получение списка валют
try {
    const collection = await service.get();
    console.log(collection);
} catch (e) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

// Получение списка валют с фильтром
const filter = new CurrenciesFilter();
filter.setLimit(50);
filter.setPage(2);

try {
    const collection = await service.get(filter);
    console.log(collection);
} catch (e) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}
```

## Примеры

В рамках данного репозитория имеется папка examples с различными примерами.

Для их работы необходимо добавить в неё файл .env со следующим содержимым, указав ваши значения:
```dotenv
CLIENT_ID="UUID интеграци"
CLIENT_SECRET="Секретный ключ интеграции"
CLIENT_REDIRECT_URI="https://example.com/examples/get_token.ts (Важно обратить внимание, что он должен содержать в себе точно тот адрес, который был указан при создании интеграции)"
```

Затем вы можете запустить примеры командой ```npx ts-node```. Например, для получения Access Token выполните:
```npx ts-node examples/get_token.ts```
Для получения доступа к вашему локальному серверу извне можно использовать сервис ngrok.io.

После авторизации вы можете проверить работу примеров, запуская их через ```npx ts-node```. Стоит отметить, что для корректной работы примеров
необходимо проверить ID сущностей в них.

## Работа с Issues
Если вы столкнулись с проблемой при работе с библиотекой, вы можете составить Issue, который будет рассмотрен при первой возможности.

При составлении, детально опишите проблему, приложите примеры кода, а также ответы на запросы из `getLastRequestInfo`.

Не забывайте удалять из примеров значимые данные, которые не должны стать достоянием общественности.

Также могут быть рассмотрены пожелания по улучшению библиотеки.

Вы можете предложить свои исправления/изменения исходного кода библиотеки, посредством создания Issue с описанием, а также Pull request с упоминанием Issue в комментарии к нему.
Они будут рассмотрены и будут приняты или отклонены. Некоторые Pull Request могут остаться без ответа и действия, в случае, если правки потенциально жизнеспособны, но в данный момент не являются ключевыми для проекта.

Если вы столкнулись с проблемой функционала amoCRM - обратитесь в техническую поддержку через чат в вашем аккаунте.

## License

MIT
