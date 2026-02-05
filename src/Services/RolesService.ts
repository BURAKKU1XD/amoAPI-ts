import { BaseEntity, ApiResponse } from './BaseEntity';
import type { AmoCRMApiRequest } from '../Client/AmoCRMApiRequest';
import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';
import type { BaseEntityFilter } from '../Filters/BaseEntityFilter';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';

type RoleModel = BaseApiModel & {
  setId(id: number): void;
  setName?(name: string): void;
  setRights?(rights: unknown): void;
  setUsers?(users: unknown): void;
};
type RolesCollection = BaseApiCollection<RoleModel>;
type RolesFilter = BaseEntityFilter;

/**
 * Roles entity service
 *
 * Provides CRUD operations for role entities in amoCRM.
 * Supports page methods and delete operations.
 */
export class RolesService extends BaseEntity<RoleModel, RolesCollection, RolesFilter> {
  protected method = 'api/v4/roles';
  protected collectionClass: any;

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<RoleModel> {
    return null as any;
  }

  protected getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[] {
    return (response._embedded?.[EntityTypes.USER_ROLES] || []) as Record<string, unknown>[];
  }

  protected processUpdateOne(model: RoleModel, response: ApiResponse): RoleModel {
    this.processModelAction(model, response as unknown as Record<string, unknown>);
    return model;
  }

  protected processUpdate(collection: RolesCollection, response: ApiResponse): RolesCollection {
    return this.processAction(collection, response);
  }

  protected processAdd(collection: RolesCollection, response: ApiResponse): RolesCollection {
    return this.processAction(collection, response);
  }

  private processAction(collection: RolesCollection, response: ApiResponse): RolesCollection {
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

  private processModelAction(model: RoleModel, entity: Record<string, unknown>): void {
    if (entity['id'] !== undefined) model.setId(entity['id'] as number);
    if (entity['name'] !== undefined && model.setName) model.setName(entity['name'] as string);
    if (entity['rights'] !== undefined && model.setRights) model.setRights(entity['rights']);
    if (entity['users'] !== undefined && model.setUsers) model.setUsers(entity['users']);
  }

  /**
   * Delete a single role by ID
   */
  async deleteOne(id: number): Promise<void> {
    await this.request.delete(`${this.method}/${id}`);
  }

  // -- Page methods --

  async nextPage(collection: RolesCollection): Promise<RolesCollection | null> {
    const link = collection.getNextPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }

  async prevPage(collection: RolesCollection): Promise<RolesCollection | null> {
    const link = collection.getPrevPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }
}
