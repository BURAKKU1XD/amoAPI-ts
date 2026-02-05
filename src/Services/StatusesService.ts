import { BaseEntity, ApiResponse } from './BaseEntity';
import type { AmoCRMApiRequest } from '../Client/AmoCRMApiRequest';
import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';
import type { BaseEntityFilter } from '../Filters/BaseEntityFilter';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';

type StatusModel = BaseApiModel & {
  setId(id: number): void;
  setUpdatedAt?(updatedAt: number): void;
  setAccountId?(accountId: number): void;
};
type StatusesCollection = BaseApiCollection<StatusModel>;
type StatusesFilter = BaseEntityFilter;

/**
 * Statuses entity service
 *
 * Provides CRUD operations for pipeline status entities in amoCRM.
 * This is a sub-entity service that requires a parent pipeline ID.
 * Supports delete operations.
 */
export class StatusesService extends BaseEntity<StatusModel, StatusesCollection, StatusesFilter> {
  protected method = 'api/v4/leads/pipelines';
  protected collectionClass: any;
  private parentId: number;

  constructor(request: AmoCRMApiRequest, pipelineId: number) {
    super(request);
    this.collectionClass = null as any;
    this.parentId = pipelineId;
  }

  protected getMethod(): string {
    return `${this.method}/${this.parentId}/statuses`;
  }

  protected getItemClass(): ModelConstructor<StatusModel> {
    return null as any;
  }

  protected getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[] {
    return (response._embedded?.[EntityTypes.LEADS_STATUSES] || []) as Record<string, unknown>[];
  }

  protected processUpdateOne(model: StatusModel, response: ApiResponse): StatusModel {
    this.processModelAction(model, response as unknown as Record<string, unknown>);
    return model;
  }

  protected processUpdate(collection: StatusesCollection, response: ApiResponse): StatusesCollection {
    return this.processAction(collection, response);
  }

  protected processAdd(collection: StatusesCollection, response: ApiResponse): StatusesCollection {
    return this.processAction(collection, response);
  }

  private processAction(collection: StatusesCollection, response: ApiResponse): StatusesCollection {
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

  private processModelAction(model: StatusModel, entity: Record<string, unknown>): void {
    if (entity['id'] !== undefined) model.setId(entity['id'] as number);
    if (entity['account_id'] !== undefined && model.setAccountId) model.setAccountId(entity['account_id'] as number);
  }

  /**
   * Delete a single status by ID
   */
  async deleteOne(id: number): Promise<void> {
    await this.request.delete(`${this.getMethod()}/${id}`);
  }
}
