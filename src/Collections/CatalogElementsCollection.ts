import { BaseApiCollection } from './BaseApiCollection';
import { CatalogElementModel } from '../Models/CatalogElementModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class CatalogElementsCollection extends BaseApiCollection<CatalogElementModel> {
  protected getItemClass(): ModelConstructor<CatalogElementModel> {
    return CatalogElementModel;
  }
}
