import { BaseEntity, ApiResponse } from './BaseEntity';
import type { AmoCRMApiRequest } from '../Client/AmoCRMApiRequest';
import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';
import type { BaseEntityFilter } from '../Filters/BaseEntityFilter';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';
import { NotAvailableForActionException } from '../Exceptions/NotAvailableForActionException';

/**
 * Placeholder types
 */
type TagModel = BaseApiModel & {
  setId(id: number): void;
  setName(name: string): void;
  setColor(color: string | null): void;
};
type TagsCollection = BaseApiCollection<TagModel>;
type TagsFilter = BaseEntityFilter;

/**
 * Available entity types for tags
 */
const AVAILABLE_TAG_ENTITY_TYPES = [
  EntityTypes.LEADS,
  EntityTypes.CONTACTS,
  EntityTypes.COMPANIES,
  EntityTypes.CUSTOMERS,
];

/**
 * Entity Tags service
 *
 * Provides operations for tag entities in amoCRM.
 * Requires an entity type to be set (leads, contacts, companies, customers).
 * Extends BaseEntity with entity type parameterization in the URL.
 */
export class TagsService extends BaseEntity<TagModel, TagsCollection, TagsFilter> {
  protected method = 'api/v4/%s/tags';
  protected collectionClass: any;
  protected entityType = '';

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<TagModel> {
    return null as any;
  }

  /**
   * Set the entity type for this service
   */
  setEntityType(entityType: string): this {
    entityType = this.validateEntityType(entityType);
    this.entityType = entityType;
    return this;
  }

  /**
   * Get the current entity type
   */
  getEntityType(): string {
    return this.entityType;
  }

  /**
   * Validate the entity type
   */
  private validateEntityType(entityType: string): string {
    if (!AVAILABLE_TAG_ENTITY_TYPES.includes(entityType as any)) {
      throw new InvalidArgumentException("This method doesn't support given entity type");
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
    return (response._embedded?.[EntityTypes.TAGS] || []) as Record<string, unknown>[];
  }

  /**
   * getOne is not available for tags
   */
  async getOne(_id: number | string, _withRelations: string[] = []): Promise<TagModel | null> {
    throw new NotAvailableForActionException('No such method for this entity');
  }

  /**
   * Update is only available for leads tags
   */
  async update(collection: TagsCollection): Promise<TagsCollection> {
    if (this.entityType === EntityTypes.LEADS) {
      return super.update(collection);
    }
    throw new NotAvailableForActionException('This entity can not be updated');
  }

  /**
   * UpdateOne is only available for leads tags
   */
  async updateOne(model: TagModel): Promise<TagModel> {
    if (this.entityType === EntityTypes.LEADS) {
      return super.updateOne(model);
    }
    throw new NotAvailableForActionException('This entity can not be updated');
  }

  /**
   * syncOne is not available for tags
   */
  async syncOne(_model: TagModel, _withRelations: string[] = []): Promise<TagModel> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  protected processUpdateOne(model: TagModel, response: ApiResponse): TagModel {
    this.processModelAction(model, response as unknown as Record<string, unknown>);
    return model;
  }

  protected processUpdate(collection: TagsCollection, response: ApiResponse): TagsCollection {
    return this.processAction(collection, response);
  }

  protected processAdd(collection: TagsCollection, response: ApiResponse): TagsCollection {
    return this.processAction(collection, response);
  }

  private processAction(collection: TagsCollection, response: ApiResponse): TagsCollection {
    const entities = this.getEntitiesFromResponse(response);
    for (const entity of entities) {
      if ('request_id' in entity) {
        const initialEntity = collection.getBy('requestId', entity['request_id']);
        if (initialEntity) {
          this.processModelAction(initialEntity, entity);
        }
      }
      if ('id' in entity) {
        const initialEntity = collection.getBy('id', entity['id']);
        if (initialEntity) {
          this.processModelAction(initialEntity, entity);
        }
      }
    }
    return collection;
  }

  private processModelAction(model: TagModel, entity: Record<string, unknown>): void {
    if (entity['id'] !== undefined) {
      model.setId(entity['id'] as number);
    }
    if (entity['name'] !== undefined) {
      model.setName(entity['name'] as string);
    }
    if ('color' in entity) {
      model.setColor(entity['color'] as string | null);
    }
  }

  // -- Page methods --

  async nextPage(collection: TagsCollection): Promise<TagsCollection | null> {
    const link = collection.getNextPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }

  async prevPage(collection: TagsCollection): Promise<TagsCollection | null> {
    const link = collection.getPrevPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }
}
