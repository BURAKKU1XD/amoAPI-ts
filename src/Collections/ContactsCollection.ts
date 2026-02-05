import { BaseApiCollection } from './BaseApiCollection';
import { ContactModel } from '../Models/ContactModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class ContactsCollection extends BaseApiCollection<ContactModel> {
  protected getItemClass(): ModelConstructor<ContactModel> {
    return ContactModel;
  }
}
