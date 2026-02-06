import { BaseEntity, ApiResponse } from './BaseEntity';
import type { AmoCRMApiRequest } from '../Client/AmoCRMApiRequest';
import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';
import type { BaseEntityFilter } from '../Filters/BaseEntityFilter';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';
import { NotAvailableForActionException } from '../Exceptions/NotAvailableForActionException';

type UserModel = BaseApiModel & {
  setId(id: number): void;
  setName?(name: string): void;
  setEmail?(email: string): void;
  setRights?(rights: unknown): void;
};
type UsersCollection = BaseApiCollection<UserModel>;
type UsersFilter = BaseEntityFilter;

/**
 * Users entity service
 *
 * Provides read operations for user entities in amoCRM.
 * Update operations are not available through this service.
 */
export class UsersService extends BaseEntity<UserModel, UsersCollection, UsersFilter> {
  protected method = 'api/v4/users';
  protected collectionClass: any;

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<UserModel> {
    return null as any;
  }

  protected getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[] {
    return (response._embedded?.[EntityTypes.USERS] || []) as Record<string, unknown>[];
  }

  protected processAdd(collection: UsersCollection, response: ApiResponse): UsersCollection {
    return this.processAction(collection, response);
  }

  private processAction(collection: UsersCollection, response: ApiResponse): UsersCollection {
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

  private processModelAction(model: UserModel, entity: Record<string, unknown>): void {
    if (entity['id'] !== undefined) model.setId(entity['id'] as number);
    if (entity['name'] !== undefined && model.setName) model.setName(entity['name'] as string);
    if (entity['email'] !== undefined && model.setEmail) model.setEmail(entity['email'] as string);
    if (entity['rights'] !== undefined && model.setRights) model.setRights(entity['rights']);
  }

  async update(_collection: UsersCollection): Promise<UsersCollection> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async updateOne(_model: UserModel): Promise<UserModel> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  // -- Page methods --

  async nextPage(collection: UsersCollection): Promise<UsersCollection | null> {
    const link = collection.getNextPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }

  async prevPage(collection: UsersCollection): Promise<UsersCollection | null> {
    const link = collection.getPrevPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }
}
