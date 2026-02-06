import { BaseEntity, ApiResponse } from './BaseEntity';
import type { AmoCRMApiRequest } from '../Client/AmoCRMApiRequest';
import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';
import type { BaseEntityFilter } from '../Filters/BaseEntityFilter';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';
import { NotAvailableForActionException } from '../Exceptions/NotAvailableForActionException';

type LossReasonModel = BaseApiModel & {
  setId(id: number): void;
  setUpdatedAt?(updatedAt: number): void;
};
type LossReasonsCollection = BaseApiCollection<LossReasonModel>;
type LossReasonsFilter = BaseEntityFilter;

/**
 * Loss reasons entity service
 *
 * Provides CRUD operations for loss reason entities in amoCRM.
 * Supports delete operations. Batch update is not available.
 */
export class LossReasonsService extends BaseEntity<LossReasonModel, LossReasonsCollection, LossReasonsFilter> {
  protected method = 'api/v4/leads/loss_reasons';
  protected collectionClass: any;

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<LossReasonModel> {
    return null as any;
  }

  protected getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[] {
    return (response._embedded?.[EntityTypes.LEADS_LOSS_REASONS] || []) as Record<string, unknown>[];
  }

  protected processUpdateOne(model: LossReasonModel, response: ApiResponse): LossReasonModel {
    this.processModelAction(model, response as unknown as Record<string, unknown>);
    return model;
  }

  protected processAdd(collection: LossReasonsCollection, response: ApiResponse): LossReasonsCollection {
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

  private processModelAction(model: LossReasonModel, entity: Record<string, unknown>): void {
    if (entity['id'] !== undefined) model.setId(entity['id'] as number);
  }

  async update(_collection: LossReasonsCollection): Promise<LossReasonsCollection> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  /**
   * Delete a single loss reason by ID
   */
  async deleteOne(id: number): Promise<void> {
    await this.request.delete(`${this.method}/${id}`);
  }
}
