import { BaseApiCollection } from './BaseApiCollection';
import { LossReasonModel } from '../Models/LossReasonModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class LossReasonsCollection extends BaseApiCollection<LossReasonModel> {
  protected getItemClass(): ModelConstructor<LossReasonModel> {
    return LossReasonModel;
  }
}
