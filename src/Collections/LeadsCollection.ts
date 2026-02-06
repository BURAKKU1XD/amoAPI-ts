import { BaseApiCollection } from './BaseApiCollection';
import { LeadModel } from '../Models/LeadModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class LeadsCollection extends BaseApiCollection<LeadModel> {
  protected getItemClass(): ModelConstructor<LeadModel> {
    return LeadModel;
  }
}
