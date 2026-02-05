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
type CustomFieldGroupModel = BaseApiModel & {
  setId(id: number): void;
  setName(name: string): void;
  getId(): number | null;
  getEntityType?(): string;
};
type CustomFieldGroupsCollection = BaseApiCollection<CustomFieldGroupModel>;
type CustomFieldGroupsFilter = BaseEntityFilter;

/**
 * Custom Field Groups entity service
 *
 * Provides CRUD operations for custom field groups (tabs) in amoCRM.
 * Requires an entity type.
 * Supports delete operations.
 */
export class CustomFieldGroupsService extends BaseEntity<
  CustomFieldGroupModel,
  CustomFieldGroupsCollection,
  CustomFieldGroupsFilter
> {
  protected method = 'api/v4/%s/custom_fields/groups';
  protected collectionClass: any;
  protected entityType = '';

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<CustomFieldGroupModel> {
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
   * Validate entity type
   */
  private validateEntityType(entityType: string): string {
    const availableEntities = [
      EntityTypes.CONTACTS,
      EntityTypes.LEADS,
      EntityTypes.CUSTOMERS,
      EntityTypes.COMPANIES,
    ];

    if (!availableEntities.includes(entityType as any)) {
      // Check for catalog pattern
      const catalogMatch = entityType.match(new RegExp(EntityTypes.CATALOGS + ':(\\d+)'));
      if (catalogMatch && parseInt(catalogMatch[1]) > EntityTypes.MIN_CATALOG_ID) {
        entityType = EntityTypes.CATALOGS + '/' + parseInt(catalogMatch[1]);
      } else {
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
    return (response._embedded?.[EntityTypes.CUSTOM_FIELD_GROUPS] || []) as Record<string, unknown>[];
  }

  /**
   * Batch update not supported
   */
  async update(_collection: CustomFieldGroupsCollection): Promise<CustomFieldGroupsCollection> {
    throw new NotAvailableForActionException('This entity supports only updateOne method');
  }

  /**
   * Delete a single group
   */
  async deleteOne(model: CustomFieldGroupModel): Promise<boolean> {
    const result = await this.request.delete(this.getMethod() + '/' + model.getId());
    return result['result'] as boolean;
  }

  /**
   * Batch delete not supported
   */
  async deleteCollection(_collection: CustomFieldGroupsCollection): Promise<boolean> {
    throw new NotAvailableForActionException('This entity supports only deleteOne method');
  }

  /**
   * Sync one - sets entity type from model
   */
  async syncOne(model: CustomFieldGroupModel, withRelations: string[] = []): Promise<CustomFieldGroupModel> {
    if (model.getEntityType) {
      this.setEntityType(model.getEntityType());
    }
    return super.syncOne(model, withRelations);
  }

  protected processUpdateOne(model: CustomFieldGroupModel, response: ApiResponse): CustomFieldGroupModel {
    this.processModelAction(model, response as unknown as Record<string, unknown>);
    return model;
  }

  protected processUpdate(
    collection: CustomFieldGroupsCollection,
    response: ApiResponse
  ): CustomFieldGroupsCollection {
    return this.processAction(collection, response);
  }

  protected processAdd(
    collection: CustomFieldGroupsCollection,
    response: ApiResponse
  ): CustomFieldGroupsCollection {
    return this.processAction(collection, response);
  }

  private processAction(
    collection: CustomFieldGroupsCollection,
    response: ApiResponse
  ): CustomFieldGroupsCollection {
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

  private processModelAction(model: CustomFieldGroupModel, entity: Record<string, unknown>): void {
    if (entity['id'] !== undefined) {
      model.setId(entity['id'] as number);
    }
    if (entity['name'] !== undefined) {
      model.setName(entity['name'] as string);
    }
  }
}
