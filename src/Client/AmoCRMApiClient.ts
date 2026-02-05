import { AmoCRMOAuth, TokenRefreshCallback } from '../OAuth/AmoCRMOAuth';
import type { AccessTokenInterface } from '../OAuth/AccessToken';
import { AmoCRMApiRequest } from './AmoCRMApiRequest';
import { AmoCRMMissedTokenException } from '../Exceptions/AmoCRMMissedTokenException';

// Service imports
import { LeadsService } from '../Services/LeadsService';
import { ContactsService } from '../Services/ContactsService';
import { CompaniesService } from '../Services/CompaniesService';
import { TasksService } from '../Services/TasksService';
import { NotesService } from '../Services/NotesService';
import { TagsService } from '../Services/TagsService';
import { EventsService } from '../Services/EventsService';
import { WebhooksService } from '../Services/WebhooksService';
import { AccountService } from '../Services/AccountService';
import { CallsService } from '../Services/CallsService';
import { CatalogsService } from '../Services/CatalogsService';
import { CatalogElementsService } from '../Services/CatalogElementsService';
import { CustomFieldsService } from '../Services/CustomFieldsService';
import { CustomFieldGroupsService } from '../Services/CustomFieldGroupsService';
import { LinksService } from '../Services/LinksService';
import { UsersService } from '../Services/UsersService';
import { RolesService } from '../Services/RolesService';
import { UnsortedService } from '../Services/UnsortedService';
import { FilesService } from '../Services/FilesService';
import { ShortLinksService } from '../Services/ShortLinksService';
import { PipelinesService } from '../Services/PipelinesService';
import { StatusesService } from '../Services/StatusesService';
import { LossReasonsService } from '../Services/LossReasonsService';
import { SourcesService } from '../Services/SourcesService';
import { CustomersService } from '../Services/CustomersService';

/**
 * AmoCRM API Client
 *
 * Main entry point for interacting with the amoCRM API.
 * Provides lazy-loaded service accessors for all entity types.
 */
export class AmoCRMApiClient {
  static readonly API_VERSION = 4;
  static readonly DRIVE_API_VERSION = 'v1.0';

  private oAuthClient: AmoCRMOAuth;
  private accountBaseDomain: string = '';
  private accessToken: AccessTokenInterface | null = null;
  private accessTokenRefreshCallback: TokenRefreshCallback | null = null;
  private contextUserId: number | null = null;
  private userAgent: string | null = null;

  constructor(clientId?: string | null, clientSecret?: string | null, redirectUri?: string | null) {
    this.oAuthClient = new AmoCRMOAuth(
      clientId || '',
      clientSecret || '',
      redirectUri || ''
    );
  }

  /**
   * Set the access token for API requests
   */
  setAccessToken(accessToken: AccessTokenInterface): this {
    this.accessToken = accessToken;
    return this;
  }

  /**
   * Get the current access token
   */
  getAccessToken(): AccessTokenInterface | null {
    return this.accessToken;
  }

  /**
   * Get the context user ID
   */
  getContextUserId(): number | null {
    return this.contextUserId;
  }

  /**
   * Create a new client instance with a specific user context
   */
  withContextUserId(contextUserId: number | null): AmoCRMApiClient {
    const apiClient = new AmoCRMApiClient();
    Object.assign(apiClient, this);
    apiClient.contextUserId = contextUserId;
    return apiClient;
  }

  /**
   * Set a custom user agent string
   */
  setUserAgent(userAgent: string | null): this {
    this.userAgent = userAgent;
    return this;
  }

  /**
   * Get the user agent string
   */
  getUserAgent(): string | null {
    return this.userAgent;
  }

  /**
   * Set the base domain for the amoCRM account
   */
  setAccountBaseDomain(domain: string): this {
    this.oAuthClient.setBaseDomain(domain);
    this.accountBaseDomain = domain;
    return this;
  }

  /**
   * Get the base domain for the amoCRM account
   */
  getAccountBaseDomain(): string {
    return this.accountBaseDomain;
  }

  /**
   * Set callback for when access token is refreshed
   */
  onAccessTokenRefresh(callback: TokenRefreshCallback): this {
    this.accessTokenRefreshCallback = callback;
    return this;
  }

  /**
   * Get the OAuth client
   */
  getOAuthClient(): AmoCRMOAuth {
    return this.oAuthClient;
  }

  /**
   * Check if access token is set
   */
  isAccessTokenSet(): boolean {
    return this.accessToken !== null;
  }

  /**
   * Build the API request instance
   */
  private buildRequest(): AmoCRMApiRequest {
    if (!this.isAccessTokenSet()) {
      throw new AmoCRMMissedTokenException();
    }

    const oAuthClient = this.getOAuthClient();

    if (this.accessTokenRefreshCallback) {
      oAuthClient.setAccessTokenRefreshCallback(
        async (newToken: AccessTokenInterface, baseDomain: string) => {
          this.setAccessToken(newToken);
          if (this.accessTokenRefreshCallback) {
            await this.accessTokenRefreshCallback(newToken, baseDomain);
          }
        }
      );
    }

    return new AmoCRMApiRequest(this.accessToken!, oAuthClient);
  }

  /**
   * Get the raw API request instance for custom requests
   */
  getRequest(): AmoCRMApiRequest {
    return this.buildRequest();
  }

  // -- Entity Service Accessors --

  /**
   * Get leads service
   */
  leads(): LeadsService {
    return new LeadsService(this.buildRequest());
  }

  /**
   * Get contacts service
   */
  contacts(): ContactsService {
    return new ContactsService(this.buildRequest());
  }

  /**
   * Get companies service
   */
  companies(): CompaniesService {
    return new CompaniesService(this.buildRequest());
  }

  /**
   * Get tasks service
   */
  tasks(): TasksService {
    return new TasksService(this.buildRequest());
  }

  /**
   * Get notes service for a specific entity type
   */
  notes(entityType: string): NotesService {
    const service = new NotesService(this.buildRequest());
    // NotesService should have setEntityType if it follows EntityNotes pattern
    if ('setEntityType' in service) {
      (service as unknown as { setEntityType(t: string): void }).setEntityType(entityType);
    }
    return service;
  }

  /**
   * Get tags service for a specific entity type
   */
  tags(entityType: string): TagsService {
    const service = new TagsService(this.buildRequest());
    if ('setEntityType' in service) {
      (service as unknown as { setEntityType(t: string): void }).setEntityType(entityType);
    }
    return service;
  }

  /**
   * Get events service
   */
  events(): EventsService {
    return new EventsService(this.buildRequest());
  }

  /**
   * Get webhooks service
   */
  webhooks(): WebhooksService {
    return new WebhooksService(this.buildRequest());
  }

  /**
   * Get account service
   */
  account(): AccountService {
    return new AccountService(this.buildRequest());
  }

  /**
   * Get calls service
   */
  calls(): CallsService {
    return new CallsService(this.buildRequest());
  }

  /**
   * Get catalogs service
   */
  catalogs(): CatalogsService {
    return new CatalogsService(this.buildRequest());
  }

  /**
   * Get catalog elements service for a specific catalog
   */
  catalogElements(catalogId?: number | null): CatalogElementsService {
    const service = new CatalogElementsService(this.buildRequest());
    if (catalogId !== undefined && catalogId !== null && 'setEntityId' in service) {
      (service as unknown as { setEntityId(id: number): void }).setEntityId(catalogId);
    }
    return service;
  }

  /**
   * Get custom fields service for a specific entity type
   */
  customFields(entityType: string): CustomFieldsService {
    const service = new CustomFieldsService(this.buildRequest());
    if ('setEntityType' in service) {
      (service as unknown as { setEntityType(t: string): void }).setEntityType(entityType);
    }
    return service;
  }

  /**
   * Get custom field groups service for a specific entity type
   */
  customFieldGroups(entityType?: string | null): CustomFieldGroupsService {
    const service = new CustomFieldGroupsService(this.buildRequest());
    if (entityType && 'setEntityType' in service) {
      (service as unknown as { setEntityType(t: string): void }).setEntityType(entityType);
    }
    return service;
  }

  /**
   * Get links service for a specific entity type
   */
  links(entityType: string): LinksService {
    const service = new LinksService(this.buildRequest());
    if ('setEntityType' in service) {
      (service as unknown as { setEntityType(t: string): void }).setEntityType(entityType);
    }
    return service;
  }

  /**
   * Get users service
   */
  users(): UsersService {
    return new UsersService(this.buildRequest());
  }

  /**
   * Get roles service
   */
  roles(): RolesService {
    return new RolesService(this.buildRequest());
  }

  /**
   * Get unsorted service
   */
  unsorted(): UnsortedService {
    return new UnsortedService(this.buildRequest());
  }

  /**
   * Get files service
   */
  files(): FilesService {
    return new FilesService(this.buildRequest());
  }

  /**
   * Get short links service
   */
  shortLinks(): ShortLinksService {
    return new ShortLinksService(this.buildRequest());
  }

  /**
   * Get pipelines service
   */
  pipelines(): PipelinesService {
    return new PipelinesService(this.buildRequest());
  }

  /**
   * Get statuses service for a specific pipeline
   */
  statuses(pipelineId: number): StatusesService {
    return new StatusesService(this.buildRequest(), pipelineId);
  }

  /**
   * Get loss reasons service
   */
  lossReasons(): LossReasonsService {
    return new LossReasonsService(this.buildRequest());
  }

  /**
   * Get sources service
   */
  sources(): SourcesService {
    return new SourcesService(this.buildRequest());
  }

  /**
   * Get customers service
   */
  customers(): CustomersService {
    return new CustomersService(this.buildRequest());
  }
}
