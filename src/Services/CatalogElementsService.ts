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
type CatalogElementModel = BaseApiModel & {
  setId(id: number): void;
  setName(name: string): void;
  setCatalogId(catalogId: number): void;
  setInvoiceLink?(invoiceLink: string): void;
  getCatalogId(): number;
};
type CatalogElementsCollection = BaseApiCollection<CatalogElementModel>;
type CatalogElementsFilter = BaseEntityFilter;

/**
 * Catalog Elements entity service
 *
 * Provides CRUD operations for catalog element entities in amoCRM.
 * Uses a parent catalog ID in the URL path.
 * Supports page methods and link methods.
 */
export class CatalogElementsService extends BaseEntity<
  CatalogElementModel,
  CatalogElementsCollection,
  CatalogElementsFilter
> {
  protected method = 'api/v4/catalogs/%s/elements';
  protected collectionClass: any;
  protected entityId = 0;

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<CatalogElementModel> {
    return null as any;
  }

  /**
   * Set the catalog (entity) ID
   */
  setEntityId(entityId: number): this {
    this.validateEntityId(entityId);
    this.entityId = entityId;
    return this;
  }

  /**
   * Get the catalog (entity) ID
   */
  getEntityId(): number {
    return this.entityId;
  }

  /**
   * Validate the entity ID
   */
  private validateEntityId(entityId: number): void {
    if (entityId < EntityTypes.MIN_CATALOG_ID) {
      throw new NotAvailableForActionException("Doesn't look like catalog exists");
    }
  }

  /**
   * Get the API method with entity ID interpolated
   */
  protected getMethod(): string {
    return this.method.replace('%s', String(this.entityId));
  }

  protected getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[] {
    return (response._embedded?.[EntityTypes.CATALOG_ELEMENTS] || []) as Record<string, unknown>[];
  }

  /**
   * Sync one - sets catalog ID from model
   */
  async syncOne(
    model: CatalogElementModel,
    withRelations: string[] = []
  ): Promise<CatalogElementModel> {
    this.setEntityId(model.getCatalogId());
    return super.syncOne(model, withRelations);
  }

  protected processUpdateOne(
    model: CatalogElementModel,
    response: ApiResponse
  ): CatalogElementModel {
    this.processModelAction(model, response as unknown as Record<string, unknown>);
    return model;
  }

  protected processUpdate(
    collection: CatalogElementsCollection,
    response: ApiResponse
  ): CatalogElementsCollection {
    return this.processAction(collection, response);
  }

  protected processAdd(
    collection: CatalogElementsCollection,
    response: ApiResponse
  ): CatalogElementsCollection {
    return this.processAction(collection, response);
  }

  private processAction(
    collection: CatalogElementsCollection,
    response: ApiResponse
  ): CatalogElementsCollection {
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

  private processModelAction(model: CatalogElementModel, entity: Record<string, unknown>): void {
    if (entity['id'] !== undefined) {
      model.setId(entity['id'] as number);
    }
    if (entity['name'] !== undefined) {
      model.setName(entity['name'] as string);
    }
    if (entity['catalog_id'] !== undefined) {
      model.setCatalogId(entity['catalog_id'] as number);
    }
    if (entity['invoice_link'] !== undefined && model.setInvoiceLink) {
      model.setInvoiceLink(entity['invoice_link'] as string);
    }
  }

  // -- Page methods --

  async nextPage(collection: CatalogElementsCollection): Promise<CatalogElementsCollection | null> {
    const link = collection.getNextPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }

  async prevPage(collection: CatalogElementsCollection): Promise<CatalogElementsCollection | null> {
    const link = collection.getPrevPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }
}
