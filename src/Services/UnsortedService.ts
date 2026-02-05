import { BaseEntity, ApiResponse } from './BaseEntity';
import type { AmoCRMApiRequest } from '../Client/AmoCRMApiRequest';
import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';
import type { BaseEntityFilter } from '../Filters/BaseEntityFilter';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';
import { NotAvailableForActionException } from '../Exceptions/NotAvailableForActionException';

type UnsortedModel = BaseApiModel & {
  setUid?(uid: string): void;
  getCategory?(): string | null;
};
type UnsortedCollection = BaseApiCollection<UnsortedModel>;
type UnsortedFilter = BaseEntityFilter;

/**
 * Unsorted entity service
 *
 * Provides operations for unsorted (incoming) entities in amoCRM.
 * Supports accept, decline, link, and summary operations.
 */
export class UnsortedService extends BaseEntity<UnsortedModel, UnsortedCollection, UnsortedFilter> {
  protected method = 'api/v4/leads/unsorted';
  protected collectionClass: any;

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<UnsortedModel> {
    return null as any;
  }

  protected getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[] {
    return (response._embedded?.[EntityTypes.UNSORTED] || []) as Record<string, unknown>[];
  }

  protected processAdd(collection: UnsortedCollection, response: ApiResponse): UnsortedCollection {
    const entities = this.getEntitiesFromResponse(response);
    for (const entity of entities) {
      if ('request_id' in entity) {
        const initialEntity = collection.getBy('requestId', entity['request_id']);
        if (initialEntity && entity['uid'] !== undefined && initialEntity.setUid) {
          initialEntity.setUid(entity['uid'] as string);
        }
      }
    }
    return collection;
  }

  /**
   * Accept an unsorted entity
   */
  async accept(uid: string, body: Record<string, unknown> = {}): Promise<ApiResponse> {
    const response = await this.request.post(`${this.method}/${uid}/accept`, body);
    return response;
  }

  /**
   * Decline an unsorted entity
   */
  async decline(uid: string, body: Record<string, unknown> = {}): Promise<ApiResponse> {
    const response = await this.request.delete(`${this.method}/${uid}/decline`, body);
    return response;
  }

  /**
   * Link an unsorted entity
   */
  async link(uid: string, body: Record<string, unknown> = {}): Promise<ApiResponse> {
    const response = await this.request.post(`${this.method}/${uid}/link`, body);
    return response;
  }

  /**
   * Get unsorted summary
   */
  async summary(): Promise<ApiResponse> {
    const response = await this.request.get(`${this.method}/summary`);
    return response;
  }

  async update(_collection: UnsortedCollection): Promise<UnsortedCollection> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async updateOne(_model: UnsortedModel): Promise<UnsortedModel> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async syncOne(_model: UnsortedModel): Promise<UnsortedModel> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  // -- Page methods --

  async nextPage(collection: UnsortedCollection): Promise<UnsortedCollection | null> {
    const link = collection.getNextPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }

  async prevPage(collection: UnsortedCollection): Promise<UnsortedCollection | null> {
    const link = collection.getPrevPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }
}
