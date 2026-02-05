import { BaseApiCollection } from './BaseApiCollection';
import { StatusModel } from '../Models/StatusModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class StatusesCollection extends BaseApiCollection<StatusModel> {
  protected getItemClass(): ModelConstructor<StatusModel> {
    return StatusModel;
  }
}
