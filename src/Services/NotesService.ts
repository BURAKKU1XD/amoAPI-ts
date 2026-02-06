import { BaseEntity, ApiResponse } from './BaseEntity';
import type { AmoCRMApiRequest } from '../Client/AmoCRMApiRequest';
import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';
import type { BaseEntityFilter, FilterParams } from '../Filters/BaseEntityFilter';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';
import { AmoCRMApiException } from '../Exceptions/AmoCRMApiException';

/**
 * Placeholder types
 */
type NoteModel = BaseApiModel & {
  setId(id: number): void;
  setEntityId(entityId: number): void;
  getId(): number | null;
  getEntityId?(): number | null;
};
type NotesCollection = BaseApiCollection<NoteModel>;
type NotesFilter = BaseEntityFilter;

/**
 * Available entity types for notes
 */
const AVAILABLE_NOTE_ENTITY_TYPES = [
  EntityTypes.LEADS,
  EntityTypes.CONTACTS,
  EntityTypes.COMPANIES,
  EntityTypes.CUSTOMERS,
];

/**
 * Parent entity keys
 */
const PARENT_ID_KEY = 'parent_id';
const ID_KEY = 'id';

/**
 * Entity Notes service
 *
 * Provides CRUD operations for note entities in amoCRM.
 * Requires an entity type (leads, contacts, companies, customers).
 * Supports parent entity methods for getting notes by parent entity ID.
 */
export class NotesService extends BaseEntity<NoteModel, NotesCollection, NotesFilter> {
  protected method = 'api/v4/%s/notes';
  protected methodWithParent = 'api/v4/%s/%s/notes';
  protected collectionClass: any;
  protected entityType = '';

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<NoteModel> {
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
    if (!AVAILABLE_NOTE_ENTITY_TYPES.includes(entityType as any)) {
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

  /**
   * Get method with parent entity ID
   */
  private getMethodWithParent(parentId: number | string, id?: number | string | null): string {
    let method = this.methodWithParent
      .replace('%s', this.entityType)
      .replace('%s', String(parentId));
    if (id !== null && id !== undefined) {
      method += '/' + id;
    }
    return method;
  }

  protected getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[] {
    return (response._embedded?.[EntityTypes.NOTES] || []) as Record<string, unknown>[];
  }

  /**
   * Get a single note by composite ID (parent_id + id)
   */
  async getOne(
    id: number | string | Record<string, unknown>,
    withRelations: string[] = []
  ): Promise<NoteModel | null> {
    const queryParams: FilterParams = {};

    const ItemClass = this.getItemClass();
    if (ItemClass) {
      const availableWith = (ItemClass as unknown as { getAvailableWith(): string[] }).getAvailableWith();
      const validWith = withRelations.filter((w) => availableWith.includes(w));
      if (validWith.length > 0) {
        queryParams['with'] = validWith.join(',');
      }
    }

    let parentId: number | string | null = null;
    let noteId: number | string | null = null;

    if (typeof id === 'object' && id !== null) {
      parentId = id[PARENT_ID_KEY] as number | string ?? null;
      noteId = id[ID_KEY] as number | string ?? null;
    } else {
      noteId = id;
    }

    const response = await this.request.get(
      this.getMethodWithParent(parentId!, noteId),
      queryParams
    );

    if (!response || Object.keys(response).length === 0) {
      return null;
    }

    if (ItemClass) {
      const entity = new ItemClass();
      return entity.fromArray(response as Record<string, unknown>) as NoteModel;
    }
    return null;
  }

  /**
   * Get notes by parent entity ID
   */
  async getByParentId(
    parentId: number,
    filter?: NotesFilter | null,
    withRelations: string[] = []
  ): Promise<NotesCollection | null> {
    const queryParams: FilterParams = {};
    if (filter) {
      Object.assign(queryParams, filter.buildFilter());
    }

    const ItemClass = this.getItemClass();
    if (ItemClass) {
      const availableWith = (ItemClass as unknown as { getAvailableWith(): string[] }).getAvailableWith();
      const validWith = withRelations.filter((w) => availableWith.includes(w));
      if (validWith.length > 0) {
        queryParams['with'] = validWith.join(',');
      }
    }

    const response = await this.request.get(
      this.getMethodWithParent(parentId),
      queryParams
    );
    return this.createCollection(response);
  }

  /**
   * Update a single note - requires parent entity ID
   */
  async updateOne(model: NoteModel): Promise<NoteModel> {
    const id = model.getId();
    if (id === null) {
      throw new AmoCRMApiException('Empty id in model ' + JSON.stringify(model.toArray()));
    }

    const parentId = model.getEntityId ? model.getEntityId() : null;
    if (parentId === null) {
      throw new AmoCRMApiException('Parent id in model ' + JSON.stringify(model.toArray()));
    }

    const response = await this.request.patch(
      this.getMethodWithParent(parentId, id),
      model.toApi()
    );
    return this.processUpdateOne(model, response);
  }

  /**
   * Sync a single note
   */
  async syncOne(model: NoteModel, withRelations: string[] = []): Promise<NoteModel> {
    const id = model.getId();
    if (id === null) {
      throw new AmoCRMApiException('Empty id in model ' + JSON.stringify(model.toArray()));
    }

    const parentId = model.getEntityId ? model.getEntityId() : null;
    if (parentId === null) {
      throw new AmoCRMApiException('Parent id in model ' + JSON.stringify(model.toArray()));
    }

    const freshModel = await this.getOne(
      { [ID_KEY]: id, [PARENT_ID_KEY]: parentId },
      withRelations
    );
    if (!freshModel) {
      throw new AmoCRMApiException('Failed to fetch entity');
    }
    return this.mergeModels(freshModel, model);
  }

  protected processUpdateOne(model: NoteModel, response: ApiResponse): NoteModel {
    this.processModelAction(model, response as unknown as Record<string, unknown>);
    return model;
  }

  protected processUpdate(collection: NotesCollection, response: ApiResponse): NotesCollection {
    return this.processAction(collection, response);
  }

  protected processAdd(collection: NotesCollection, response: ApiResponse): NotesCollection {
    return this.processAction(collection, response);
  }

  private processAction(collection: NotesCollection, response: ApiResponse): NotesCollection {
    const entities = this.getEntitiesFromResponse(response);
    for (const entity of entities) {
      if ('request_id' in entity) {
        const initialEntity = collection.getBy('requestId', entity['request_id']);
        if (initialEntity) {
          this.processModelAction(initialEntity, entity);
        }
      } else if (entity['id']) {
        const initialEntity = collection.getBy('id', entity['id']);
        if (initialEntity) {
          this.processModelAction(initialEntity, entity);
        }
      }
    }
    return collection;
  }

  private processModelAction(model: NoteModel, entity: Record<string, unknown>): void {
    if (entity['id'] !== undefined) {
      model.setId(entity['id'] as number);
    }
    if (entity['entity_id'] !== undefined) {
      model.setEntityId(entity['entity_id'] as number);
    }
  }

  // -- Page methods --

  async nextPage(collection: NotesCollection): Promise<NotesCollection | null> {
    const link = collection.getNextPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }

  async prevPage(collection: NotesCollection): Promise<NotesCollection | null> {
    const link = collection.getPrevPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }
}
