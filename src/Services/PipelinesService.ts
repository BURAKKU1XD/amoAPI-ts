import { BaseEntity, ApiResponse } from './BaseEntity';
import type { AmoCRMApiRequest } from '../Client/AmoCRMApiRequest';
import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';
import type { BaseEntityFilter } from '../Filters/BaseEntityFilter';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';
import { NotAvailableForActionException } from '../Exceptions/NotAvailableForActionException';

type PipelineModel = BaseApiModel & {
  setId(id: number): void;
  setUpdatedAt?(updatedAt: number): void;
  setAccountId?(accountId: number): void;
};
type PipelinesCollection = BaseApiCollection<PipelineModel>;
type PipelinesFilter = BaseEntityFilter;

/**
 * Pipelines entity service
 *
 * Provides CRUD operations for pipeline entities in amoCRM.
 * Supports delete operations. Batch update is not available.
 */
export class PipelinesService extends BaseEntity<PipelineModel, PipelinesCollection, PipelinesFilter> {
  protected method = 'api/v4/leads/pipelines';
  protected collectionClass: any;

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<PipelineModel> {
    return null as any;
  }

  protected getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[] {
    return (response._embedded?.[EntityTypes.LEADS_PIPELINES] || []) as Record<string, unknown>[];
  }

  protected processUpdateOne(model: PipelineModel, response: ApiResponse): PipelineModel {
    this.processModelAction(model, response as unknown as Record<string, unknown>);
    return model;
  }

  protected processAdd(collection: PipelinesCollection, response: ApiResponse): PipelinesCollection {
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

  private processModelAction(model: PipelineModel, entity: Record<string, unknown>): void {
    if (entity['id'] !== undefined) model.setId(entity['id'] as number);
    if (entity['account_id'] !== undefined && model.setAccountId) model.setAccountId(entity['account_id'] as number);
  }

  async update(_collection: PipelinesCollection): Promise<PipelinesCollection> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  /**
   * Delete a single pipeline by ID
   */
  async deleteOne(id: number): Promise<void> {
    await this.request.delete(`${this.method}/${id}`);
  }
}
