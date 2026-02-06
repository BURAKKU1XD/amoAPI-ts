import { BaseEntityFilter, FilterParams, RangeFilter } from './BaseEntityFilter';

export interface LeadStatusFilter {
  status_id: number | null;
  pipeline_id: number | null;
}

export class TasksFilter extends BaseEntityFilter {
  private ids: number[] | null = null;
  private createdBy: number[] | null = null;
  private responsibleUserId: number[] | null = null;
  private updatedAt: number | RangeFilter | null = null;
  private isCompleted: boolean | null = null;
  private taskTypeId: number | null = null;
  private entityType: string | null = null;
  private entityIds: number | number[] | null = null;
  private leadStatuses: LeadStatusFilter[] | null = null;
  private order: Record<string, string> | null = null;

  getIds() { return this.ids; }
  setIds(ids: number | number[]) { this.ids = this.parseArrayOrNumberFilter(ids); return this; }
  getCreatedBy() { return this.createdBy; }
  setCreatedBy(v: number | number[]) { this.createdBy = this.parseArrayOrNumberFilter(v); return this; }
  getResponsibleUserId() { return this.responsibleUserId; }
  setResponsibleUserId(v: number | number[]) { this.responsibleUserId = this.parseArrayOrNumberFilter(v); return this; }
  getUpdatedAt() { return this.updatedAt; }
  setUpdatedAt(v: number | RangeFilter | null) { this.updatedAt = this.parseIntOrIntRangeFilter(v); return this; }
  getIsCompleted() { return this.isCompleted; }
  setIsCompleted(v: boolean | null) { this.isCompleted = v; return this; }
  getTaskTypeId() { return this.taskTypeId; }
  setTaskTypeId(v: number | null) { this.taskTypeId = v; return this; }
  getEntityType() { return this.entityType; }
  setEntityType(v: string | null) { this.entityType = v; return this; }
  getEntityIds() { return this.entityIds; }
  setEntityIds(v: number | number[] | null) { this.entityIds = v; return this; }
  getLeadStatuses() { return this.leadStatuses; }
  setLeadStatuses(statuses: Array<{ status_id?: number; pipeline_id?: number }>) {
    this.leadStatuses = statuses.map(s => ({
      status_id: s.status_id ?? null,
      pipeline_id: s.pipeline_id ?? null,
    }));
    return this;
  }
  getOrder() { return this.order; }
  setOrder(o: Record<string, string>) { this.order = o; return this; }

  buildFilter(): FilterParams {
    const filter: FilterParams = {};
    const f: Record<string, unknown> = {};
    if (this.ids !== null) f['id'] = this.ids;
    if (this.createdBy !== null) f['created_by'] = this.createdBy;
    if (this.isCompleted !== null) f['is_completed'] = this.isCompleted;
    if (this.taskTypeId !== null) { f['task_type'] = this.taskTypeId; f['task_type_id'] = this.taskTypeId; }
    if (this.responsibleUserId !== null) f['responsible_user_id'] = this.responsibleUserId;
    if (this.entityType !== null) {
      f['entity_type'] = this.entityType;
      if (this.entityIds !== null) f['entity_id'] = this.entityIds;
    }
    if (this.updatedAt !== null) f['updated_at'] = this.updatedAt;
    if (this.leadStatuses !== null) f['lead_statuses'] = this.leadStatuses;
    if (Object.keys(f).length > 0) filter['filter'] = f;
    if (this.order !== null) filter['order'] = this.order;
    return this.buildPagesFilter(filter);
  }
}
