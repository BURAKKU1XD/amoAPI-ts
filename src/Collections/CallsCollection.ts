import { BaseApiCollection } from './BaseApiCollection';
import { CallModel } from '../Models/CallModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class CallsCollection extends BaseApiCollection<CallModel> {
  protected getItemClass(): ModelConstructor<CallModel> {
    return CallModel;
  }
}
