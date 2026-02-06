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
type LinkModel = BaseApiModel;
type LinksCollection = BaseApiCollection<LinkModel>;
type LinksFilter = BaseEntityFilter;

/**
 * Available entity types for links
 */
const AVAILABLE_LINK_ENTITY_TYPES = [
  EntityTypes.CONTACTS,
  EntityTypes.LEADS,
  EntityTypes.CUSTOMERS,
  EntityTypes.COMPANIES,
];

/**
 * Links entity service
 *
 * Provides operations for entity links in amoCRM.
 * Requires an entity type (leads, contacts, companies, customers).
 * Supports get, add (link), and delete (unlink) operations.
 */
export class LinksService extends BaseEntity<LinkModel, LinksCollection, LinksFilter> {
  protected method = 'api/v4/%s';
  protected collectionClass: any;
  protected entityType = '';

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<LinkModel> {
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
   * Get the current entity type
   */
  getEntityType(): string {
    return this.entityType;
  }

  /**
   * Validate entity type
   */
  private validateEntityType(entityType: string): string {
    if (!AVAILABLE_LINK_ENTITY_TYPES.includes(entityType as any)) {
      throw new InvalidArgumentException('Entity is not supported by this method');
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
    return (response._embedded?.[EntityTypes.LINKS] || []) as Record<string, unknown>[];
  }

  /**
   * Get links for the entity type
   */
  async get(filter?: LinksFilter | null, _withRelations: string[] = []): Promise<LinksCollection | null> {
    const queryParams: Record<string, unknown> = {};
    if (filter) {
      Object.assign(queryParams, filter.buildFilter());
    }
    const response = await this.request.get(this.getMethod() + '/' + EntityTypes.LINKS, queryParams);
    return this.createCollection(response);
  }

  /**
   * Add (link) entities
   */
  async add(collection: LinksCollection): Promise<LinksCollection> {
    await this.request.post(this.getMethod() + '/link', collection.toApi());
    return collection;
  }

  /**
   * Delete (unlink) entities
   */
  async deleteLinks(collection: LinksCollection): Promise<LinksCollection> {
    await this.request.post(this.getMethod() + '/unlink', collection.toApi());
    return collection;
  }

  // -- Not available methods --

  async getOne(_id: number | string, _withRelations: string[] = []): Promise<LinkModel | null> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async addOne(_model: LinkModel): Promise<LinkModel> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async update(_collection: LinksCollection): Promise<LinksCollection> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async updateOne(_model: LinkModel): Promise<LinkModel> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async syncOne(_model: LinkModel, _withRelations: string[] = []): Promise<LinkModel> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }
}
