import { BaseApiCollection } from './BaseApiCollection';
import { CustomerModel } from '../Models/CustomerModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class CustomersCollection extends BaseApiCollection<CustomerModel> {
  protected getItemClass(): ModelConstructor<CustomerModel> {
    return CustomerModel;
  }
}
