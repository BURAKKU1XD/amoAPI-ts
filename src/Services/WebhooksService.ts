import { BaseEntity, ApiResponse } from './BaseEntity';
import type { AmoCRMApiRequest } from '../Client/AmoCRMApiRequest';
import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';
import type { BaseEntityFilter } from '../Filters/BaseEntityFilter';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';
import { NotAvailableForActionException } from '../Exceptions/NotAvailableForActionException';

/**
 * Placeholder types
 */
type WebhookModel = BaseApiModel & {
  setId(id: number): void;
  getId(): number | null;
};
type WebhooksCollection = BaseApiCollection<WebhookModel>;
type WebhooksFilter = BaseEntityFilter;

/**
 * Webhooks entity service
 *
 * Provides CRUD operations for webhook subscriptions in amoCRM.
 * Supports subscribe (add) and unsubscribe (delete) operations.
 */
export class WebhooksService extends BaseEntity<WebhookModel, WebhooksCollection, WebhooksFilter> {
  protected method = 'api/v4/webhooks';
  protected collectionClass: any;

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<WebhookModel> {
    return null as any;
  }

  protected getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[] {
    return (response._embedded?.[EntityTypes.WEBHOOKS] || []) as Record<string, unknown>[];
  }

  /**
   * Subscribe (add) a webhook
   */
  async subscribe(model: WebhookModel): Promise<WebhookModel> {
    return this.addOne(model);
  }

  /**
   * Unsubscribe (delete) a webhook
   */
  async unsubscribe(model: WebhookModel): Promise<boolean> {
    return this.deleteOne(model);
  }

  /**
   * Delete a single webhook
   */
  async deleteOne(model: WebhookModel): Promise<boolean> {
    const result = await this.request.delete(this.getMethod() + '/' + model.getId());
    return result['result'] as boolean;
  }

  /**
   * Batch delete not supported
   */
  async deleteCollection(_collection: WebhooksCollection): Promise<boolean> {
    throw new NotAvailableForActionException('This entity supports only deleteOne method');
  }

  // -- Not available methods --

  async updateOne(_model: WebhookModel): Promise<WebhookModel> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async update(_collection: WebhooksCollection): Promise<WebhooksCollection> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async syncOne(_model: WebhookModel, _withRelations: string[] = []): Promise<WebhookModel> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  protected processAdd(collection: WebhooksCollection, response: ApiResponse): WebhooksCollection {
    return this.processAction(collection, response);
  }

  private processAction(collection: WebhooksCollection, response: ApiResponse): WebhooksCollection {
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

  private processModelAction(model: WebhookModel, entity: Record<string, unknown>): void {
    if (entity['id'] !== undefined) {
      model.setId(entity['id'] as number);
    }
  }
}
