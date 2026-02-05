import { BaseApiCollection } from './BaseApiCollection';
import { CompanyModel } from '../Models/CompanyModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class CompaniesCollection extends BaseApiCollection<CompanyModel> {
  protected getItemClass(): ModelConstructor<CompanyModel> {
    return CompanyModel;
  }
}
