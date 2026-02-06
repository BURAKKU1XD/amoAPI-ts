import { BaseApiCollection } from './BaseApiCollection';
import { SourceModel } from '../Models/SourceModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class SourcesCollection extends BaseApiCollection<SourceModel> {
  protected getItemClass(): ModelConstructor<SourceModel> {
    return SourceModel;
  }
}
