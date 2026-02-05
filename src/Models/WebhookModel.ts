import { BaseApiModel } from './BaseApiModel';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';

export class WebhookModel extends BaseApiModel {
  static readonly ACTION_ADD_LEAD = 'add_lead';
  static readonly ACTION_UPDATE_LEAD = 'update_lead';
  static readonly ACTION_DELETE_LEAD = 'delete_lead';
  static readonly ACTION_RESTORE_LEAD = 'restore_lead';
  static readonly ACTION_STATUS_LEAD = 'status_lead';
  static readonly ACTION_RESPONSIBLE_LEAD = 'responsible_lead';
  static readonly ACTION_ADD_CONTACT = 'add_contact';
  static readonly ACTION_UPDATE_CONTACT = 'update_contact';
  static readonly ACTION_DELETE_CONTACT = 'delete_contact';
  static readonly ACTION_RESTORE_CONTACT = 'restore_contact';
  static readonly ACTION_ADD_COMPANY = 'add_company';
  static readonly ACTION_UPDATE_COMPANY = 'update_company';
  static readonly ACTION_DELETE_COMPANY = 'delete_company';
  static readonly ACTION_RESTORE_COMPANY = 'restore_company';
  static readonly ACTION_ADD_TASK = 'add_task';
  static readonly ACTION_UPDATE_TASK = 'update_task';
  static readonly ACTION_DELETE_TASK = 'delete_task';
  static readonly ACTION_COMPLETE_TASK = 'complete_task';
  static readonly ACTION_ADD_NOTE = 'note';

  protected id: number | null = null;
  protected destination: string | null = null;
  protected settings: string[] | null = null;
  protected sort: number | null = null;
  protected disabled: boolean | null = null;
  protected createdAt: number | null = null;
  protected updatedAt: number | null = null;

  getId() { return this.id; }
  setId(id: number) { this.id = id; return this; }
  getDestination() { return this.destination; }
  setDestination(d: string | null) { this.destination = d; return this; }
  getSettings() { return this.settings; }
  setSettings(s: string[] | null) { this.settings = s; return this; }
  getSort() { return this.sort; }
  setSort(s: number | null) { this.sort = s; return this; }
  getDisabled() { return this.disabled; }
  setDisabled(d: boolean | null) { this.disabled = d; return this; }
  getCreatedAt() { return this.createdAt; }
  setCreatedAt(ts: number | null) { this.createdAt = ts; return this; }
  getUpdatedAt() { return this.updatedAt; }
  setUpdatedAt(ts: number | null) { this.updatedAt = ts; return this; }

  fromArray(data: Record<string, unknown>): this {
    if (!data['id']) {
      throw new InvalidArgumentException('Webhook id is empty in ' + JSON.stringify(data));
    }
    this.setId(Number(data['id']));
    if (data['destination'] !== undefined && data['destination'] !== null) this.setDestination(String(data['destination']));
    if (data['settings'] !== undefined && data['settings'] !== null) this.setSettings(data['settings'] as string[]);
    if (data['sort'] !== undefined && data['sort'] !== null) this.setSort(Number(data['sort']));
    if (data['disabled'] !== undefined && data['disabled'] !== null) this.setDisabled(Boolean(data['disabled']));
    if (data['created_at']) this.setCreatedAt(Number(data['created_at']));
    if (data['updated_at']) this.setUpdatedAt(Number(data['updated_at']));
    return this as this;
  }

  toArray(): Record<string, unknown> {
    return {
      id: this.id, destination: this.destination,
      settings: this.settings, sort: this.sort,
      disabled: this.disabled,
      created_at: this.createdAt, updated_at: this.updatedAt,
    };
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    if (this.destination !== null) result['destination'] = this.destination;
    if (this.settings !== null) result['settings'] = this.settings;
    if (this.sort !== null) result['sort'] = this.sort;
    return result;
  }
}
