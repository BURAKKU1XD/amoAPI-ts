import { BaseEntity, ApiResponse } from './BaseEntity';
import type { AmoCRMApiRequest } from '../Client/AmoCRMApiRequest';
import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';
import type { BaseEntityFilter } from '../Filters/BaseEntityFilter';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';

/**
 * Placeholder types - replace with actual imports when models/collections/filters are created
 */
type ContactModel = BaseApiModel & {
  setId(id: number): void;
  setUpdatedAt(updatedAt: number): void;
};
type ContactsCollection = BaseApiCollection<ContactModel>;
type ContactsFilter = BaseEntityFilter;

/**
 * Contacts entity service
 *
 * Provides CRUD operations for contact entities in amoCRM.
 * Supports page methods and link methods.
 */
export class ContactsService extends BaseEntity<ContactModel, ContactsCollection, ContactsFilter> {
  protected method = 'api/v4/contacts';
  protected collectionClass: any;

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<ContactModel> {
    return null as any;
  }

  protected getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[] {
    return (response._embedded?.[EntityTypes.CONTACTS] || []) as Record<string, unknown>[];
  }

  protected processUpdateOne(model: ContactModel, response: ApiResponse): ContactModel {
    this.processModelAction(model, response as unknown as Record<string, unknown>);
    return model;
  }

  protected processUpdate(collection: ContactsCollection, response: ApiResponse): ContactsCollection {
    return this.processAction(collection, response);
  }

  protected processAdd(collection: ContactsCollection, response: ApiResponse): ContactsCollection {
    return this.processAction(collection, response);
  }

  private processAction(collection: ContactsCollection, response: ApiResponse): ContactsCollection {
    const entities = this.getEntitiesFromResponse(response);
    for (const entity of entities) {
      if ('request_id' in entity) {
        const initialEntity = collection.getBy('requestId', entity['request_id']);
        if (initialEntity) {
          this.processModelAction(initialEntity, entity);
        }
      }
    }
    return collection;
  }

  private processModelAction(model: ContactModel, entity: Record<string, unknown>): void {
    if (entity['id'] !== undefined) {
      model.setId(entity['id'] as number);
    }
    if (entity['updated_at'] !== undefined) {
      model.setUpdatedAt(entity['updated_at'] as number);
    }
  }

  /**
   * Get linked chats for contacts
   */
  async getChats(filter: BaseEntityFilter): Promise<ApiResponse> {
    const response = await this.request.get(this.method + '/chats', filter.buildFilter());
    return response;
  }

  /**
   * Link chats to contacts
   */
  async linkChats(linksData: unknown[]): Promise<ApiResponse> {
    const response = await this.request.post(this.method + '/chats', linksData);
    return response;
  }

  // -- Page methods --

  async nextPage(collection: ContactsCollection): Promise<ContactsCollection | null> {
    const link = collection.getNextPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }

  async prevPage(collection: ContactsCollection): Promise<ContactsCollection | null> {
    const link = collection.getPrevPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }
}
