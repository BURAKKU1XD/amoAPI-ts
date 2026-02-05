import { BaseApiCollection } from './BaseApiCollection';
import { CustomFieldGroupModel } from '../Models/CustomFieldGroupModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class CustomFieldGroupsCollection extends BaseApiCollection<CustomFieldGroupModel> {
  protected getItemClass(): ModelConstructor<CustomFieldGroupModel> {
    return CustomFieldGroupModel;
  }
}
