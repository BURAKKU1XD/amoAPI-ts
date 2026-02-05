import { BaseApiCollection } from './BaseApiCollection';
import { CustomFieldModel } from '../Models/CustomFieldModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class CustomFieldsCollection extends BaseApiCollection<CustomFieldModel> {
  protected getItemClass(): ModelConstructor<CustomFieldModel> {
    return CustomFieldModel;
  }
}
