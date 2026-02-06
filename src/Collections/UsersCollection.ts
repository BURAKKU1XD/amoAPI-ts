import { BaseApiCollection } from './BaseApiCollection';
import { UserModel } from '../Models/UserModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class UsersCollection extends BaseApiCollection<UserModel> {
  protected getItemClass(): ModelConstructor<UserModel> {
    return UserModel;
  }
}
