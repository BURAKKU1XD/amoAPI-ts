import { BaseApiCollection } from './BaseApiCollection';
import { WebhookModel } from '../Models/WebhookModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class WebhooksCollection extends BaseApiCollection<WebhookModel> {
  protected getItemClass(): ModelConstructor<WebhookModel> {
    return WebhookModel;
  }
}
