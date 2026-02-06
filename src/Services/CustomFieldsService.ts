import { BaseEntity, ApiResponse } from './BaseEntity';
import type { AmoCRMApiRequest } from '../Client/AmoCRMApiRequest';
import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';
import type { BaseEntityFilter, FilterParams } from '../Filters/BaseEntityFilter';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';
import { NotAvailableForActionException } from '../Exceptions/NotAvailableForActionException';
import { AmoCRMApiException } from '../Exceptions/AmoCRMApiException';

/**
 * Placeholder types
 */
type CustomFieldModel = BaseApiModel & {
  setEntityType?(entityType: string): void;
  getId(): number | null;
};
type CustomFieldsCollection = BaseApiCollection<CustomFieldModel>;
type CustomFieldsFilter = BaseEntityFilter;

/**
 * Custom Fields entity service
 *
 * Provides CRUD operations for custom fields in amoCRM.
 * Requires an entity type (leads, contacts, companies, customers, segments, or catalogs).
 * Supports delete operations.
 */
export class CustomFieldsService extends BaseEntity<CustomFieldModel, CustomFieldsCollection, CustomFieldsFilter> {
  protected method = 'api/v4/%s/custom_fields';
  protected collectionClass: any;
  protected entityType = '';
  protected cleanEntityType = '';

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<CustomFieldModel> {
    return null as any;
  }

  /**
   * Set the entity type
   */
  setEntityType(entityType: string): this {
    entityType = this.validateEntityType(entityType);
    this.entityType = entityType;
    return this;
  }

  /**
   * Get the entity type
   */
  getEntityType(): string {
    return this.entityType;
  }

  /**
   * Validate entity type with support for catalogs and segments
   */
  private validateEntityType(entityType: string): string {
    const availableEntities = [
      EntityTypes.CONTACTS,
      EntityTypes.LEADS,
      EntityTypes.CUSTOMERS,
      EntityTypes.COMPANIES,
      EntityTypes.CUSTOMERS + '/' + EntityTypes.CUSTOMERS_SEGMENTS,
    ];

    this.cleanEntityType = entityType;

    if (entityType === EntityTypes.CUSTOMERS_SEGMENTS) {
      entityType = EntityTypes.CUSTOMERS + '/' + EntityTypes.CUSTOMERS_SEGMENTS;
    }

    if (!availableEntities.includes(entityType)) {
      // Check for catalog pattern like "catalogs:1234"
      const catalogMatch = entityType.match(new RegExp(EntityTypes.CATALOGS + ':(\\d+)'));
      if (catalogMatch && parseInt(catalogMatch[1]) > EntityTypes.MIN_CATALOG_ID) {
        this.cleanEntityType = EntityTypes.CATALOGS;
        entityType = EntityTypes.CATALOGS + '/' + parseInt(catalogMatch[1]);
      } else {
        this.cleanEntityType = '';
        throw new InvalidArgumentException('Entity is not supported by this method');
      }
    }

    return entityType;
  }

  /**
   * Get the API method with entity type interpolated
   */
  protected getMethod(): string {
    return this.method.replace('%s', this.entityType);
  }

  protected getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[] {
    return (response._embedded?.[EntityTypes.CUSTOM_FIELDS] || []) as Record<string, unknown>[];
  }

  /**
   * Get a single custom field by ID
   */
  async getOne(id: number | string, withRelations: string[] = []): Promise<CustomFieldModel | null> {
    const queryParams: FilterParams = {};
    const ItemClass = this.getItemClass();
    if (ItemClass) {
      const availableWith = (ItemClass as unknown as { getAvailableWith(): string[] }).getAvailableWith();
      const validWith = withRelations.filter((w) => availableWith.includes(w));
      if (validWith.length > 0) {
        queryParams['with'] = validWith.join(',');
      }
    }

    const response = await this.request.get(this.getMethod() + '/' + id, queryParams);

    if (!response || Object.keys(response).length === 0) {
      return null;
    }

    if (ItemClass) {
      const CollectionClass = this.collectionClass;
      const collection = (CollectionClass as unknown as {
        fromArray(arr: Record<string, unknown>[]): CustomFieldsCollection;
      }).fromArray([response as Record<string, unknown>]);
      return collection.first();
    }
    return null;
  }

  /**
   * Add a collection - sets entity type on each model
   */
  async add(collection: CustomFieldsCollection): Promise<CustomFieldsCollection> {
    for (const model of collection) {
      if (model.setEntityType) {
        model.setEntityType(this.cleanEntityType);
      }
    }
    const response = await this.request.post(this.getMethod(), collection.toApi());
    return this.processAdd(collection, response);
  }

  /**
   * Add a single custom field
   */
  async addOne(model: CustomFieldModel): Promise<CustomFieldModel> {
    if (model.setEntityType) {
      model.setEntityType(this.cleanEntityType);
    }
    const CollectionClass = this.collectionClass;
    const collection = new CollectionClass() as CustomFieldsCollection;
    collection.add(model);
    const resultCollection = await this.add(collection);
    return resultCollection.first()!;
  }

  /**
   * Update a single custom field
   */
  async updateOne(model: CustomFieldModel): Promise<CustomFieldModel> {
    const id = model.getId();
    if (id === null) {
      throw new AmoCRMApiException('Empty id in model ' + JSON.stringify(model.toApi(0)));
    }
    if (model.setEntityType) {
      model.setEntityType(this.cleanEntityType);
    }
    const response = await this.request.patch(this.getMethod() + '/' + id, model.toApi(0));
    return this.processUpdateOne(model, response);
  }

  /**
   * Update collection is not supported - use updateOne
   */
  async update(_collection: CustomFieldsCollection): Promise<CustomFieldsCollection> {
    throw new NotAvailableForActionException('This entity supports only updateOne method');
  }

  /**
   * Delete a single custom field
   */
  async deleteOne(model: CustomFieldModel): Promise<boolean> {
    const result = await this.request.delete(this.getMethod() + '/' + model.getId());
    return result['result'] as boolean;
  }

  /**
   * Batch delete is not supported
   */
  async deleteCollection(_collection: CustomFieldsCollection): Promise<boolean> {
    throw new NotAvailableForActionException('This entity supports only deleteOne method');
  }

  /**
   * Sync a single custom field
   */
  async syncOne(model: CustomFieldModel, withRelations: string[] = []): Promise<CustomFieldModel> {
    if (model.setEntityType) {
      model.setEntityType(this.cleanEntityType);
    }
    const freshModel = await this.getOne(model.getId()!, withRelations);
    if (!freshModel) {
      throw new AmoCRMApiException('Failed to fetch entity');
    }
    return this.mergeModels(freshModel, model);
  }

  protected processUpdateOne(model: CustomFieldModel, response: ApiResponse): CustomFieldModel {
    this.processModelAction(model, response as unknown as Record<string, unknown>);
    return model;
  }

  protected processUpdate(collection: CustomFieldsCollection, response: ApiResponse): CustomFieldsCollection {
    return this.processAction(collection, response);
  }

  protected processAdd(collection: CustomFieldsCollection, response: ApiResponse): CustomFieldsCollection {
    return this.processAction(collection, response);
  }

  private processAction(collection: CustomFieldsCollection, response: ApiResponse): CustomFieldsCollection {
    const entities = this.getEntitiesFromResponse(response);
    for (const entity of entities) {
      if ('request_id' in entity) {
        const initialEntity = collection.getBy('requestId', entity['request_id']);
        if (initialEntity) {
          this.processModelAction(initialEntity, entity);
          collection.replaceBy('requestId', entity['request_id'], initialEntity);
        }
      }
    }
    return collection;
  }

  private processModelAction(_model: CustomFieldModel, _entity: Record<string, unknown>): void {
    // In PHP, this creates a new model from factory. In TS, we update in place.
    // Custom field models will be created via factory when model layer is complete.
  }

  /**
   * Override checkModelsClasses for custom field inheritance
   */
  protected checkModelsClasses(objectA: CustomFieldModel, objectB: CustomFieldModel): void {
    if (!(objectA instanceof objectB.constructor) && !(objectB instanceof objectA.constructor)) {
      throw new InvalidArgumentException('Can not merge 2 different objects');
    }
  }

  // -- Page methods --

  async nextPage(collection: CustomFieldsCollection): Promise<CustomFieldsCollection | null> {
    const link = collection.getNextPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }

  async prevPage(collection: CustomFieldsCollection): Promise<CustomFieldsCollection | null> {
    const link = collection.getPrevPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }
}
