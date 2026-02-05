import { BaseEntity, ApiResponse } from './BaseEntity';
import type { AmoCRMApiRequest } from '../Client/AmoCRMApiRequest';
import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';
import type { BaseEntityFilter } from '../Filters/BaseEntityFilter';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';

type SourceModel = BaseApiModel & {
  setId(id: number | null): void;
  setUpdatedAt?(updatedAt: number): void;
};
type SourcesCollection = BaseApiCollection<SourceModel>;
type SourcesFilter = BaseEntityFilter;

/**
 * Sources entity service
 *
 * Provides CRUD operations for source entities in amoCRM.
 * Supports delete operations.
 */
export class SourcesService extends BaseEntity<SourceModel, SourcesCollection, SourcesFilter> {
  protected method = 'api/v4/sources';
  protected collectionClass: any;

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<SourceModel> {
    return null as any;
  }

  protected getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[] {
    return (response._embedded?.[EntityTypes.SOURCES] || []) as Record<string, unknown>[];
  }

  protected processUpdateOne(model: SourceModel, response: ApiResponse): SourceModel {
    this.processModelAction(model, response as unknown as Record<string, unknown>);
    return model;
  }

  protected processUpdate(collection: SourcesCollection, response: ApiResponse): SourcesCollection {
    return this.processAction(collection, response);
  }

  protected processAdd(collection: SourcesCollection, response: ApiResponse): SourcesCollection {
    return this.processAction(collection, response);
  }

  private processAction(collection: SourcesCollection, response: ApiResponse): SourcesCollection {
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

  private processModelAction(model: SourceModel, entity: Record<string, unknown>): void {
    if (entity['id'] !== undefined) model.setId(entity['id'] as number);
  }

  /**
   * Delete a single source by ID
   */
  async deleteOne(id: number): Promise<void> {
    await this.request.delete(`${this.method}/${id}`);
  }
}
