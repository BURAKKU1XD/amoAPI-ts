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
type EventModel = BaseApiModel;
type EventsCollection = BaseApiCollection<EventModel>;
type EventsFilter = BaseEntityFilter;

/**
 * Events entity service
 *
 * Provides read-only operations for event entities in amoCRM.
 * Events are not writable - add, update, and delete operations throw exceptions.
 * Supports page methods.
 */
export class EventsService extends BaseEntity<EventModel, EventsCollection, EventsFilter> {
  protected method = 'api/v4/events';
  protected collectionClass: any;

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<EventModel> {
    return null as any;
  }

  protected getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[] {
    return (response._embedded?.[EntityTypes.EVENTS] || []) as Record<string, unknown>[];
  }

  // -- Read-only entity: all write operations throw --

  async addOne(_model: EventModel): Promise<EventModel> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async add(_collection: EventsCollection): Promise<EventsCollection> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async updateOne(_model: EventModel): Promise<EventModel> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async update(_collection: EventsCollection): Promise<EventsCollection> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async syncOne(_model: EventModel, _withRelations: string[] = []): Promise<EventModel> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  // -- Page methods --

  async nextPage(collection: EventsCollection): Promise<EventsCollection | null> {
    const link = collection.getNextPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }

  async prevPage(collection: EventsCollection): Promise<EventsCollection | null> {
    const link = collection.getPrevPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }
}
