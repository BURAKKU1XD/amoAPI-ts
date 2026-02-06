import { BaseEntity, ApiResponse } from './BaseEntity';
import type { AmoCRMApiRequest } from '../Client/AmoCRMApiRequest';
import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';
import type { BaseEntityFilter } from '../Filters/BaseEntityFilter';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';

type CatalogModel = BaseApiModel & {
  setId(id: number): void;
  setUpdatedAt(updatedAt: number): void;
};
type CatalogsCollection = BaseApiCollection<CatalogModel>;
type CatalogsFilter = BaseEntityFilter;

/**
 * Catalogs entity service
 *
 * Provides CRUD operations for catalog entities in amoCRM.
 * Supports page methods.
 */
export class CatalogsService extends BaseEntity<CatalogModel, CatalogsCollection, CatalogsFilter> {
  protected method = 'api/v4/catalogs';
  protected collectionClass: any;

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<CatalogModel> {
    return null as any;
  }

  protected getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[] {
    return (response._embedded?.[EntityTypes.CATALOGS] || []) as Record<string, unknown>[];
  }

  protected processUpdateOne(model: CatalogModel, response: ApiResponse): CatalogModel {
    this.processModelAction(model, response as unknown as Record<string, unknown>);
    return model;
  }

  protected processUpdate(collection: CatalogsCollection, response: ApiResponse): CatalogsCollection {
    return this.processAction(collection, response);
  }

  protected processAdd(collection: CatalogsCollection, response: ApiResponse): CatalogsCollection {
    return this.processAction(collection, response);
  }

  private processAction(collection: CatalogsCollection, response: ApiResponse): CatalogsCollection {
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

  private processModelAction(model: CatalogModel, entity: Record<string, unknown>): void {
    if (entity['id'] !== undefined) {
      model.setId(entity['id'] as number);
    }
    if (entity['updated_at'] !== undefined) {
      model.setUpdatedAt(entity['updated_at'] as number);
    }
  }

  // -- Page methods --

  async nextPage(collection: CatalogsCollection): Promise<CatalogsCollection | null> {
    const link = collection.getNextPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }

  async prevPage(collection: CatalogsCollection): Promise<CatalogsCollection | null> {
    const link = collection.getPrevPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }
}
