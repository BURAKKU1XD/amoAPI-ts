import { BaseApiCollection } from './BaseApiCollection';
import { RoleModel } from '../Models/RoleModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class RolesCollection extends BaseApiCollection<RoleModel> {
  protected getItemClass(): ModelConstructor<RoleModel> {
    return RoleModel;
  }
}
