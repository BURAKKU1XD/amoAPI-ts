import { BaseApiCollection } from './BaseApiCollection';
import { PipelineModel } from '../Models/PipelineModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class PipelinesCollection extends BaseApiCollection<PipelineModel> {
  protected getItemClass(): ModelConstructor<PipelineModel> {
    return PipelineModel;
  }
}
