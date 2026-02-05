import { BaseApiCollection } from './BaseApiCollection';
import { LinkModel } from '../Models/LinkModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class LinksCollection extends BaseApiCollection<LinkModel> {
  protected getItemClass(): ModelConstructor<LinkModel> {
    return LinkModel;
  }
}
