import { BaseEntity, ApiResponse } from './BaseEntity';
import type { AmoCRMApiRequest } from '../Client/AmoCRMApiRequest';
import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';
import type { BaseEntityFilter } from '../Filters/BaseEntityFilter';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';

type CustomerModel = BaseApiModel & {
  setId(id: number): void;
  setUpdatedAt(updatedAt: number): void;
};
type CustomersCollection = BaseApiCollection<CustomerModel>;
type CustomersFilter = BaseEntityFilter;

/**
 * Customers entity service
 *
 * Provides CRUD operations for customer entities in amoCRM.
 * Supports page methods and link methods.
 * Includes a mode toggle for customers functionality.
 */
export class CustomersService extends BaseEntity<CustomerModel, CustomersCollection, CustomersFilter> {
  protected method = 'api/v4/customers';
  protected collectionClass: any;

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<CustomerModel> {
    return null as any;
  }

  protected getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[] {
    return (response._embedded?.[EntityTypes.CUSTOMERS] || []) as Record<string, unknown>[];
  }

  protected processUpdateOne(model: CustomerModel, response: ApiResponse): CustomerModel {
    this.processModelAction(model, response as unknown as Record<string, unknown>);
    return model;
  }

  protected processUpdate(collection: CustomersCollection, response: ApiResponse): CustomersCollection {
    return this.processAction(collection, response);
  }

  protected processAdd(collection: CustomersCollection, response: ApiResponse): CustomersCollection {
    return this.processAction(collection, response);
  }

  private processAction(collection: CustomersCollection, response: ApiResponse): CustomersCollection {
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

  private processModelAction(model: CustomerModel, entity: Record<string, unknown>): void {
    if (entity['id'] !== undefined) {
      model.setId(entity['id'] as number);
    }
    if (entity['updated_at'] !== undefined) {
      model.setUpdatedAt(entity['updated_at'] as number);
    }
  }

  /**
   * Set the customers mode (segments or periodicity)
   */
  async setMode(mode: string, isEnabled: boolean): Promise<ApiResponse> {
    const response = await this.request.patch(`${this.method}/mode`, {
      mode,
      is_enabled: isEnabled,
    });
    return response;
  }

  // -- Page methods --

  async nextPage(collection: CustomersCollection): Promise<CustomersCollection | null> {
    const link = collection.getNextPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }

  async prevPage(collection: CustomersCollection): Promise<CustomersCollection | null> {
    const link = collection.getPrevPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }
}
