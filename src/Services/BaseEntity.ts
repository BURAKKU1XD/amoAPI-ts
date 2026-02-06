import type { AmoCRMApiRequest } from '../Client/AmoCRMApiRequest';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';
import type { BaseEntityFilter, FilterParams } from '../Filters/BaseEntityFilter';
import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import type { HasIdInterface } from '../Interfaces/HasIdInterface';
import { AmoCRMApiException } from '../Exceptions/AmoCRMApiException';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';

/**
 * API response type
 */
export interface ApiResponse {
  _embedded?: {
    [key: string]: Record<string, unknown>[];
  };
  _links?: {
    next?: { href: string };
    prev?: { href: string };
  };
  [key: string]: unknown;
}

/**
 * Collection constructor type
 */
export type CollectionConstructor<T extends BaseApiCollection<BaseApiModel>> = new () => T;

/**
 * Base abstract class for entity services
 */
export abstract class BaseEntity<
  TModel extends BaseApiModel,
  TCollection extends BaseApiCollection<TModel>,
  TFilter extends BaseEntityFilter
> {
  /**
   * API endpoint method
   */
  protected abstract method: string;

  /**
   * Collection class for this entity
   */
  protected abstract collectionClass: CollectionConstructor<TCollection>;

  /**
   * Model class for this entity
   */
  protected abstract getItemClass(): ModelConstructor<TModel>;

  /**
   * API request instance
   */
  protected request: AmoCRMApiRequest;

  /**
   * Constructor
   */
  constructor(request: AmoCRMApiRequest) {
    this.request = request;
  }

  /**
   * Get the API method/endpoint
   */
  protected getMethod(): string {
    return this.method;
  }

  /**
   * Extract entities from API response
   */
  protected abstract getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[];

  /**
   * Get collection of entities
   */
  async get(filter?: TFilter | null, withRelations: string[] = []): Promise<TCollection | null> {
    const queryParams: FilterParams = {};

    if (filter) {
      Object.assign(queryParams, filter.buildFilter());
    }

    const ItemClass = this.getItemClass();
    const availableWith = (ItemClass as unknown as { getAvailableWith(): string[] }).getAvailableWith();
    const validWith = withRelations.filter((w) => availableWith.includes(w));

    if (validWith.length > 0) {
      queryParams['with'] = validWith.join(',');
    }

    const response = await this.request.get(this.getMethod(), queryParams);
    return this.createCollection(response);
  }

  /**
   * Create collection from API response
   */
  protected createCollection(response: ApiResponse): TCollection | null {
    const CollectionClass = this.collectionClass;
    const entities = this.getEntitiesFromResponse(response);

    if (!entities || entities.length === 0) {
      return null;
    }

    const collection = (CollectionClass as unknown as {
      fromArray(arr: Record<string, unknown>[]): TCollection;
    }).fromArray(entities);

    // Set pagination links
    if (response._links?.next?.href) {
      collection.setNextPageLink(response._links.next.href);
    }

    if (response._links?.prev?.href) {
      collection.setPrevPageLink(response._links.prev.href);
    }

    return collection;
  }

  /**
   * Get a single entity by ID
   */
  async getOne(id: number | string, withRelations: string[] = []): Promise<TModel | null> {
    const queryParams: FilterParams = {};

    const ItemClass = this.getItemClass();
    const availableWith = (ItemClass as unknown as { getAvailableWith(): string[] }).getAvailableWith();
    const validWith = withRelations.filter((w) => availableWith.includes(w));

    if (validWith.length > 0) {
      queryParams['with'] = validWith.join(',');
    }

    const response = await this.request.get(`${this.getMethod()}/${id}`, queryParams);

    if (!response || Object.keys(response).length === 0) {
      return null;
    }

    const entity = new ItemClass();
    return entity.fromArray(response as Record<string, unknown>) as TModel;
  }

  /**
   * Process update response - override in subclasses
   */
  protected processUpdate(collection: TCollection, _response: ApiResponse): TCollection {
    return collection;
  }

  /**
   * Process single update response - override in subclasses
   */
  protected processUpdateOne(model: TModel, _response: ApiResponse): TModel {
    return model;
  }

  /**
   * Process add response - override in subclasses
   */
  protected processAdd(collection: TCollection, _response: ApiResponse): TCollection {
    return collection;
  }

  /**
   * Add a collection of entities
   */
  async add(collection: TCollection): Promise<TCollection> {
    const response = await this.request.post(this.getMethod(), collection.toApi());
    return this.processAdd(collection, response);
  }

  /**
   * Add a single entity
   */
  async addOne(model: TModel): Promise<TModel> {
    const CollectionClass = this.collectionClass;
    const collection = new CollectionClass() as TCollection;
    collection.add(model);
    const resultCollection = await this.add(collection);
    const firstItem = resultCollection.first();
    if (!firstItem) {
      throw new AmoCRMApiException('Failed to add entity');
    }
    return firstItem;
  }

  /**
   * Update a collection of entities
   */
  async update(collection: TCollection): Promise<TCollection> {
    const response = await this.request.patch(this.getMethod(), collection.toApi());
    return this.processUpdate(collection, response);
  }

  /**
   * Update a single entity
   */
  async updateOne(model: TModel): Promise<TModel> {
    const hasId = model as unknown as HasIdInterface;
    if (typeof hasId.getId !== 'function') {
      throw new InvalidArgumentException('Entity should have getId method');
    }

    const id = hasId.getId();
    if (id === null) {
      throw new AmoCRMApiException(`Empty id in model ${JSON.stringify(model.toApi(0))}`);
    }

    const response = await this.request.patch(
      `${this.getMethod()}/${id}`,
      model.toApi(0)
    );
    return this.processUpdateOne(model, response);
  }

  /**
   * Sync a single entity (fetch fresh copy and merge)
   */
  async syncOne(model: TModel, withRelations: string[] = []): Promise<TModel> {
    const hasId = model as unknown as HasIdInterface;
    if (typeof hasId.getId !== 'function') {
      throw new InvalidArgumentException('Entity should have getId method');
    }

    const freshModel = await this.getOne(hasId.getId()!, withRelations);
    if (!freshModel) {
      throw new AmoCRMApiException('Failed to fetch entity');
    }

    return this.mergeModels(freshModel, model);
  }

  /**
   * Check if two models are of the same class
   */
  protected checkModelsClasses(objectA: TModel, objectB: TModel): void {
    if (objectA.constructor !== objectB.constructor) {
      throw new InvalidArgumentException('Cannot merge 2 different objects');
    }
  }

  /**
   * Merge two models (objectB values take precedence if not null)
   */
  protected mergeModels(objectA: TModel, objectB: TModel): TModel {
    this.checkModelsClasses(objectA, objectB);

    const ItemClass = this.getItemClass();
    const newObject = new ItemClass() as TModel;

    const dataA = objectA.toArray();
    const dataB = objectB.toArray();

    // Merge data - B takes precedence for non-null values
    const mergedData: Record<string, unknown> = { ...dataA };
    for (const [key, value] of Object.entries(dataB)) {
      if (value !== null && value !== undefined) {
        mergedData[key] = value;
      }
    }

    return newObject.fromArray(mergedData) as TModel;
  }

  /**
   * Get last request info for debugging
   */
  getLastRequestInfo(): Record<string, unknown> {
    return this.request.getLastRequestInfo();
  }
}
