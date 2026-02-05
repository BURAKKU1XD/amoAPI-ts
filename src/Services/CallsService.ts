import { BaseEntity, ApiResponse } from './BaseEntity';
import type { AmoCRMApiRequest } from '../Client/AmoCRMApiRequest';
import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';
import type { BaseEntityFilter } from '../Filters/BaseEntityFilter';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';
import { NotAvailableForActionException } from '../Exceptions/NotAvailableForActionException';

type CallModel = BaseApiModel & {
  setId(id: number): void;
  setUpdatedAt(updatedAt: number): void;
};
type CallsCollection = BaseApiCollection<CallModel>;
type CallsFilter = BaseEntityFilter;

/**
 * Calls entity service
 *
 * Provides ability to add calls to amoCRM.
 * Only add operations are supported.
 */
export class CallsService extends BaseEntity<CallModel, CallsCollection, CallsFilter> {
  protected method = 'api/v4/calls';
  protected collectionClass: any;

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<CallModel> {
    return null as any;
  }

  protected getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[] {
    return (response._embedded?.[EntityTypes.CALLS] || []) as Record<string, unknown>[];
  }

  protected processAdd(collection: CallsCollection, response: ApiResponse): CallsCollection {
    return this.processAction(collection, response);
  }

  private processAction(collection: CallsCollection, response: ApiResponse): CallsCollection {
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

  private processModelAction(model: CallModel, entity: Record<string, unknown>): void {
    if (entity['id'] !== undefined) {
      model.setId(entity['id'] as number);
    }
    if (entity['updated_at'] !== undefined) {
      model.setUpdatedAt(entity['updated_at'] as number);
    }
  }

  async get(): Promise<CallsCollection | null> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async getOne(): Promise<CallModel | null> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async update(_collection: CallsCollection): Promise<CallsCollection> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async updateOne(_model: CallModel): Promise<CallModel> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async syncOne(_model: CallModel): Promise<CallModel> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }
}
