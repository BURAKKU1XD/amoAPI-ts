import { BaseApiCollection } from './BaseApiCollection';
import { TagModel } from '../Models/TagModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class TagsCollection extends BaseApiCollection<TagModel> {
  protected getItemClass(): ModelConstructor<TagModel> {
    return TagModel;
  }
}
