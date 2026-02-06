import { BaseApiCollection } from './BaseApiCollection';
import { CatalogModel } from '../Models/CatalogModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class CatalogsCollection extends BaseApiCollection<CatalogModel> {
  protected getItemClass(): ModelConstructor<CatalogModel> {
    return CatalogModel;
  }
}
