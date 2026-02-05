import { BaseApiCollection } from './BaseApiCollection';
import { EventModel } from '../Models/EventModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class EventsCollection extends BaseApiCollection<EventModel> {
  protected getItemClass(): ModelConstructor<EventModel> {
    return EventModel;
  }
}
