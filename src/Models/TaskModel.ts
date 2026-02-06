import { BaseApiModel } from './BaseApiModel';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';

export class TaskModel extends BaseApiModel {
  static readonly TASK_TYPE_ID_CALL = 1;
  static readonly TASK_TYPE_ID_MEETING = 2;
  static readonly TASK_TYPE_ID_LETTER = 3;

  protected id: number | null = null;
  protected createdBy: number | null = null;
  protected updatedBy: number | null = null;
  protected createdAt: number | null = null;
  protected updatedAt: number | null = null;
  protected responsibleUserId: number | null = null;
  protected groupId: number | null = null;
  protected entityId: number | null = null;
  protected entityType: string | null = null;
  protected isCompleted: boolean | null = null;
  protected taskTypeId: number | null = null;
  protected text: string | null = null;
  protected duration: number | null = null;
  protected completeTill: number | null = null;
  protected result: Record<string, unknown> | null = null;
  protected accountId: number | null = null;
  protected requestId: string | null = null;

  getType(): string { return EntityTypes.TASKS; }

  getId() { return this.id; }
  setId(id: number) { this.id = id; return this; }
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
  getEntityId() { return this.entityId; }
  setEntityId(id: number | null) { this.entityId = id; return this; }
  getEntityType() { return this.entityType; }
  setEntityType(type: string | null) { this.entityType = type; return this; }
  getIsCompleted() { return this.isCompleted; }
  setIsCompleted(flag: boolean | null) { this.isCompleted = flag; return this; }
  getTaskTypeId() { return this.taskTypeId; }
  setTaskTypeId(id: number | null) { this.taskTypeId = id; return this; }
  getText() { return this.text; }
  setText(text: string | null) { this.text = text; return this; }
  getDuration() { return this.duration; }
  setDuration(d: number | null) { this.duration = d; return this; }
  getCompleteTill() { return this.completeTill; }
  setCompleteTill(ts: number | null) { this.completeTill = ts; return this; }
  getResult() { return this.result; }
  setResult(r: Record<string, unknown> | null) { this.result = r; return this; }
  getAccountId() { return this.accountId; }
  setAccountId(id: number | null) { this.accountId = id; return this; }
  getRequestId() { return this.requestId; }
  setRequestId(id: string | null) { this.requestId = id; return this; }

  fromArray(data: Record<string, unknown>): this {
    if (!data['id']) {
      throw new InvalidArgumentException('Task id is empty in ' + JSON.stringify(data));
    }
    this.setId(Number(data['id']));
    if (data['created_by'] !== undefined && data['created_by'] !== null) this.setCreatedBy(Number(data['created_by']));
    if (data['updated_by'] !== undefined && data['updated_by'] !== null) this.setUpdatedBy(Number(data['updated_by']));
    if (data['created_at']) this.setCreatedAt(Number(data['created_at']));
    if (data['updated_at']) this.setUpdatedAt(Number(data['updated_at']));
    if (data['responsible_user_id'] !== undefined && data['responsible_user_id'] !== null) this.setResponsibleUserId(Number(data['responsible_user_id']));
    if (data['group_id'] !== undefined && data['group_id'] !== null) this.setGroupId(Number(data['group_id']));
    if (data['entity_id'] !== undefined && data['entity_id'] !== null) this.setEntityId(Number(data['entity_id']));
    if (data['entity_type'] !== undefined && data['entity_type'] !== null) this.setEntityType(String(data['entity_type']));
    if (data['is_completed'] !== undefined && data['is_completed'] !== null) this.setIsCompleted(Boolean(data['is_completed']));
    if (data['task_type_id'] !== undefined && data['task_type_id'] !== null) this.setTaskTypeId(Number(data['task_type_id']));
    if (data['text'] !== undefined && data['text'] !== null) this.setText(String(data['text']));
    if (data['duration'] !== undefined && data['duration'] !== null) this.setDuration(Number(data['duration']));
    if (data['complete_till'] !== undefined && data['complete_till'] !== null) this.setCompleteTill(Number(data['complete_till']));
    if (data['result']) this.setResult(data['result'] as Record<string, unknown>);
    if (data['account_id']) this.setAccountId(Number(data['account_id']));
    return this as this;
  }

  toArray(): Record<string, unknown> {
    return {
      id: this.id, created_by: this.createdBy, updated_by: this.updatedBy,
      created_at: this.createdAt, updated_at: this.updatedAt,
      responsible_user_id: this.responsibleUserId, group_id: this.groupId,
      entity_id: this.entityId, entity_type: this.entityType,
      is_completed: this.isCompleted, task_type_id: this.taskTypeId,
      text: this.text, duration: this.duration,
      complete_till: this.completeTill, result: this.result,
      account_id: this.accountId,
    };
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    if (this.id !== null) result['id'] = this.id;
    if (this.responsibleUserId !== null) result['responsible_user_id'] = this.responsibleUserId;
    if (this.entityId !== null) result['entity_id'] = this.entityId;
    if (this.entityType !== null) result['entity_type'] = this.entityType;
    if (this.isCompleted !== null) result['is_completed'] = this.isCompleted;
    if (this.taskTypeId !== null) result['task_type_id'] = this.taskTypeId;
    if (this.text !== null) result['text'] = this.text;
    if (this.duration !== null) result['duration'] = this.duration;
    if (this.completeTill !== null) result['complete_till'] = this.completeTill;
    if (this.result !== null) result['result'] = this.result;
    if (this.createdBy !== null) result['created_by'] = this.createdBy;
    if (this.updatedBy !== null) result['updated_by'] = this.updatedBy;
    if (this.createdAt !== null) result['created_at'] = this.createdAt;
    if (this.requestId === null && requestId !== null && requestId !== undefined) this.requestId = String(requestId);
    if (this.requestId !== null) result['request_id'] = this.requestId;
    return result;
  }
}
