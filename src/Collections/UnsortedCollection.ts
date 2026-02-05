import { BaseApiCollection } from './BaseApiCollection';
import { UnsortedModel } from '../Models/UnsortedModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class UnsortedCollection extends BaseApiCollection<UnsortedModel> {
  protected getItemClass(): ModelConstructor<UnsortedModel> {
    return UnsortedModel;
  }
}
