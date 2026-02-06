import { BaseApiModel } from './BaseApiModel';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';

export class EventModel extends BaseApiModel {
  static readonly LEAD_ADDED = 'lead_added';
  static readonly CONTACT_ADDED = 'contact_added';
  static readonly COMPANY_ADDED = 'company_added';
  static readonly LEAD_STATUS_CHANGED = 'lead_status_changed';
  static readonly LEAD_DELETED = 'lead_deleted';
  static readonly CONTACT_DELETED = 'contact_deleted';
  static readonly COMPANY_DELETED = 'company_deleted';
  static readonly ENTITY_TAG_ADDED = 'entity_tag_added';
  static readonly ENTITY_TAG_DELETED = 'entity_tag_deleted';
  static readonly ENTITY_LINKED = 'entity_linked';
  static readonly ENTITY_UNLINKED = 'entity_unlinked';
  static readonly NOTE_ADDED = 'note_added';
  static readonly TASK_ADDED = 'task_added';
  static readonly TASK_COMPLETED = 'task_completed';
  static readonly TASK_RESULT_ADDED = 'task_result_added';
  static readonly INCOMING_CALL = 'incoming_call';
  static readonly OUTGOING_CALL = 'outgoing_call';
  static readonly INCOMING_CHAT_MESSAGE = 'incoming_chat_message';
  static readonly OUTGOING_CHAT_MESSAGE = 'outgoing_chat_message';

  protected id: string | null = null;
  protected type: string | null = null;
  protected entityId: number | null = null;
  protected entityType: string | null = null;
  protected createdBy: number | null = null;
  protected createdAt: number | null = null;
  protected valueAfter: Record<string, unknown>[] | null = null;
  protected valueBefore: Record<string, unknown>[] | null = null;
  protected accountId: number | null = null;

  getId() { return this.id; }
  setId(id: string) { this.id = id; return this; }
  getEventType() { return this.type; }
  setEventType(type: string | null) { this.type = type; return this; }
  getEntityId() { return this.entityId; }
  setEntityId(id: number | null) { this.entityId = id; return this; }
  getEntityType() { return this.entityType; }
  setEntityType(type: string | null) { this.entityType = type; return this; }
  getCreatedBy() { return this.createdBy; }
  setCreatedBy(id: number | null) { this.createdBy = id; return this; }
  getCreatedAt() { return this.createdAt; }
  setCreatedAt(ts: number | null) { this.createdAt = ts; return this; }
  getValueAfter() { return this.valueAfter; }
  setValueAfter(v: Record<string, unknown>[] | null) { this.valueAfter = v; return this; }
  getValueBefore() { return this.valueBefore; }
  setValueBefore(v: Record<string, unknown>[] | null) { this.valueBefore = v; return this; }
  getAccountId() { return this.accountId; }
  setAccountId(id: number | null) { this.accountId = id; return this; }

  fromArray(data: Record<string, unknown>): this {
    if (!data['id']) {
      throw new InvalidArgumentException('Event id is empty in ' + JSON.stringify(data));
    }
    this.setId(String(data['id']));
    if (data['type'] !== undefined && data['type'] !== null) this.setEventType(String(data['type']));
    if (data['entity_id'] !== undefined && data['entity_id'] !== null) this.setEntityId(Number(data['entity_id']));
    if (data['entity_type'] !== undefined && data['entity_type'] !== null) this.setEntityType(String(data['entity_type']));
    if (data['created_by'] !== undefined && data['created_by'] !== null) this.setCreatedBy(Number(data['created_by']));
    if (data['created_at']) this.setCreatedAt(Number(data['created_at']));
    if (data['value_after']) this.setValueAfter(data['value_after'] as Record<string, unknown>[]);
    if (data['value_before']) this.setValueBefore(data['value_before'] as Record<string, unknown>[]);
    if (data['account_id']) this.setAccountId(Number(data['account_id']));
    return this as this;
  }

  toArray(): Record<string, unknown> {
    return {
      id: this.id, type: this.type,
      entity_id: this.entityId, entity_type: this.entityType,
      created_by: this.createdBy, created_at: this.createdAt,
      value_after: this.valueAfter, value_before: this.valueBefore,
      account_id: this.accountId,
    };
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    return this.toArray();
  }
}
