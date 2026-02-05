import { BaseEntity, ApiResponse } from './BaseEntity';
import type { AmoCRMApiRequest } from '../Client/AmoCRMApiRequest';
import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';
import type { BaseEntityFilter } from '../Filters/BaseEntityFilter';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';
import { NotAvailableForActionException } from '../Exceptions/NotAvailableForActionException';

type ShortLinkModel = BaseApiModel & {
  setId(id: number): void;
  setUrl?(url: string): void;
};
type ShortLinksCollection = BaseApiCollection<ShortLinkModel>;
type ShortLinksFilter = BaseEntityFilter;

/**
 * Short links entity service
 *
 * Provides ability to create short links in amoCRM.
 * Only add operations are supported.
 */
export class ShortLinksService extends BaseEntity<ShortLinkModel, ShortLinksCollection, ShortLinksFilter> {
  protected method = 'api/v4/short_links';
  protected collectionClass: any;

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<ShortLinkModel> {
    return null as any;
  }

  protected getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[] {
    return (response._embedded?.[EntityTypes.SHORT_LINKS] || []) as Record<string, unknown>[];
  }

  protected processAdd(collection: ShortLinksCollection, response: ApiResponse): ShortLinksCollection {
    const entities = this.getEntitiesFromResponse(response);
    for (const entity of entities) {
      if ('request_id' in entity) {
        const initialEntity = collection.getBy('requestId', entity['request_id']);
        if (initialEntity) {
          if (entity['id'] !== undefined) initialEntity.setId(entity['id'] as number);
          if (entity['url'] !== undefined && initialEntity.setUrl) initialEntity.setUrl(entity['url'] as string);
        }
      }
    }
    return collection;
  }

  async get(): Promise<ShortLinksCollection | null> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async getOne(): Promise<ShortLinkModel | null> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async update(_collection: ShortLinksCollection): Promise<ShortLinksCollection> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async updateOne(_model: ShortLinkModel): Promise<ShortLinkModel> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async syncOne(_model: ShortLinkModel): Promise<ShortLinkModel> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }
}
