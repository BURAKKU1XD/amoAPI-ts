import { BaseEntity, ApiResponse } from './BaseEntity';
import type { AmoCRMApiRequest } from '../Client/AmoCRMApiRequest';
import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';
import type { BaseEntityFilter } from '../Filters/BaseEntityFilter';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';

/**
 * Placeholder types
 */
type TaskModel = BaseApiModel & {
  setId(id: number): void;
  setUpdatedAt(updatedAt: number): void;
};
type TasksCollection = BaseApiCollection<TaskModel>;
type TasksFilter = BaseEntityFilter;

/**
 * Tasks entity service
 *
 * Provides CRUD operations for task entities in amoCRM.
 * Supports page methods.
 */
export class TasksService extends BaseEntity<TaskModel, TasksCollection, TasksFilter> {
  protected method = 'api/v4/tasks';
  protected collectionClass: any;

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<TaskModel> {
    return null as any;
  }

  protected getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[] {
    return (response._embedded?.[EntityTypes.TASKS] || []) as Record<string, unknown>[];
  }

  protected processUpdateOne(model: TaskModel, response: ApiResponse): TaskModel {
    this.processModelAction(model, response as unknown as Record<string, unknown>);
    return model;
  }

  protected processUpdate(collection: TasksCollection, response: ApiResponse): TasksCollection {
    return this.processAction(collection, response);
  }

  protected processAdd(collection: TasksCollection, response: ApiResponse): TasksCollection {
    return this.processAction(collection, response);
  }

  private processAction(collection: TasksCollection, response: ApiResponse): TasksCollection {
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

  private processModelAction(model: TaskModel, entity: Record<string, unknown>): void {
    if (entity['id'] !== undefined) {
      model.setId(entity['id'] as number);
    }
    if (entity['updated_at'] !== undefined) {
      model.setUpdatedAt(entity['updated_at'] as number);
    }
  }

  // -- Page methods --

  async nextPage(collection: TasksCollection): Promise<TasksCollection | null> {
    const link = collection.getNextPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }

  async prevPage(collection: TasksCollection): Promise<TasksCollection | null> {
    const link = collection.getPrevPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }
}
