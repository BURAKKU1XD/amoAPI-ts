import { BaseApiModel } from './BaseApiModel';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';

export class NoteModel extends BaseApiModel {
  static readonly NOTE_TYPE_COMMON = 'common';
  static readonly NOTE_TYPE_CALL_IN = 'call_in';
  static readonly NOTE_TYPE_CALL_OUT = 'call_out';
  static readonly NOTE_TYPE_SERVICE_MESSAGE = 'service_message';
  static readonly NOTE_TYPE_EXTENDED_SERVICE_MESSAGE = 'extended_service_message';
  static readonly NOTE_TYPE_MESSAGE_CASHIER = 'message_cashier';
  static readonly NOTE_TYPE_INVOICE_PAID = 'invoice_paid';
  static readonly NOTE_TYPE_GEOLOCATION = 'geolocation';
  static readonly NOTE_TYPE_SMS_IN = 'sms_in';
  static readonly NOTE_TYPE_SMS_OUT = 'sms_out';
  static readonly NOTE_TYPE_ATTACHMENT = 'attachment';

  protected id: number | null = null;
  protected entityId: number | null = null;
  protected createdBy: number | null = null;
  protected updatedBy: number | null = null;
  protected createdAt: number | null = null;
  protected updatedAt: number | null = null;
  protected responsibleUserId: number | null = null;
  protected groupId: number | null = null;
  protected noteType: string | null = null;
  protected params: Record<string, unknown> | null = null;
  protected accountId: number | null = null;
  protected requestId: string | null = null;

  getId() { return this.id; }
  setId(id: number) { this.id = id; return this; }
  getEntityId() { return this.entityId; }
  setEntityId(id: number | null) { this.entityId = id; return this; }
  getCreatedBy() { return this.createdBy; }
  setCreatedBy(id: number | null) { this.createdBy = id; return this; }
  getUpdatedBy() { return this.updatedBy; }
  setUpdatedBy(id: number | null) { this.updatedBy = id; return this; }
  getCreatedAt() { return this.createdAt; }
  setCreatedAt(ts: number | null) { this.createdAt = ts; return this; }
  getUpdatedAt() { return this.updatedAt; }
  setUpdatedAt(ts: number | null) { this.updatedAt = ts; return this; }
  getResponsibleUserId() { return this.responsibleUserId; }
  setResponsibleUserId(id: number | null) { this.responsibleUserId = id; return this; }
  getGroupId() { return this.groupId; }
  setGroupId(id: number | null) { this.groupId = id; return this; }
  getNoteType() { return this.noteType; }
  setNoteType(type: string | null) { this.noteType = type; return this; }
  getParams() { return this.params; }
  setParams(p: Record<string, unknown> | null) { this.params = p; return this; }
  getAccountId() { return this.accountId; }
  setAccountId(id: number | null) { this.accountId = id; return this; }
  getRequestId() { return this.requestId; }
  setRequestId(id: string | null) { this.requestId = id; return this; }

  fromArray(data: Record<string, unknown>): this {
    if (!data['id']) {
      throw new InvalidArgumentException('Note id is empty in ' + JSON.stringify(data));
    }
    this.setId(Number(data['id']));
    if (data['entity_id'] !== undefined && data['entity_id'] !== null) this.setEntityId(Number(data['entity_id']));
    if (data['created_by'] !== undefined && data['created_by'] !== null) this.setCreatedBy(Number(data['created_by']));
    if (data['updated_by'] !== undefined && data['updated_by'] !== null) this.setUpdatedBy(Number(data['updated_by']));
    if (data['created_at']) this.setCreatedAt(Number(data['created_at']));
    if (data['updated_at']) this.setUpdatedAt(Number(data['updated_at']));
    if (data['responsible_user_id'] !== undefined && data['responsible_user_id'] !== null) this.setResponsibleUserId(Number(data['responsible_user_id']));
    if (data['group_id'] !== undefined && data['group_id'] !== null) this.setGroupId(Number(data['group_id']));
    if (data['note_type'] !== undefined && data['note_type'] !== null) this.setNoteType(String(data['note_type']));
    if (data['params']) this.setParams(data['params'] as Record<string, unknown>);
    if (data['account_id']) this.setAccountId(Number(data['account_id']));
    return this as this;
  }

  toArray(): Record<string, unknown> {
    return {
      id: this.id, entity_id: this.entityId,
      created_by: this.createdBy, updated_by: this.updatedBy,
      created_at: this.createdAt, updated_at: this.updatedAt,
      responsible_user_id: this.responsibleUserId, group_id: this.groupId,
      note_type: this.noteType, params: this.params,
      account_id: this.accountId,
    };
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    if (this.id !== null) result['id'] = this.id;
    if (this.entityId !== null) result['entity_id'] = this.entityId;
    if (this.noteType !== null) result['note_type'] = this.noteType;
    if (this.params !== null) result['params'] = this.params;
    if (this.createdBy !== null) result['created_by'] = this.createdBy;
    if (this.responsibleUserId !== null) result['responsible_user_id'] = this.responsibleUserId;
    if (this.requestId === null && requestId !== null && requestId !== undefined) this.requestId = String(requestId);
    if (this.requestId !== null) result['request_id'] = this.requestId;
    return result;
  }
}
