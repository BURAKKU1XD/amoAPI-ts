import { BaseEntityFilter, FilterParams } from './BaseEntityFilter';

export class EventsFilter extends BaseEntityFilter {
  private ids: number[] | null = null;
  private types: string[] | null = null;
  private entity: string[] | null = null;
  private valueAfter: unknown[] | null = null;
  private valueBefore: unknown[] | null = null;
  private createdAt: number[] | null = null;
  private createdBy: number[] | null = null;
  private entityIds: number[] | null = null;

  getIds() { return this.ids; }
  setIds(ids: number[] | null) { this.ids = ids; return this; }
  getTypes() { return this.types; }
  setTypes(types: string[] | null) { this.types = types; return this; }
  getEntity() { return this.entity; }
  setEntity(entity: string[] | null) { this.entity = entity; return this; }
  getValueAfter() { return this.valueAfter; }
  setValueAfter(v: unknown[] | null) { this.valueAfter = v; return this; }
  getValueBefore() { return this.valueBefore; }
  setValueBefore(v: unknown[] | null) { this.valueBefore = v; return this; }
  getCreatedAt() { return this.createdAt; }
  setCreatedAt(v: number | number[]) { this.createdAt = Array.isArray(v) ? v : [v]; return this; }
  getCreatedBy() { return this.createdBy; }
  setCreatedBy(v: number | number[]) { this.createdBy = this.parseArrayOrNumberFilter(v); return this; }
  getEntityIds() { return this.entityIds; }
  setEntityIds(v: number | number[]) { this.entityIds = this.parseArrayOrNumberFilter(v); return this; }

  buildFilter(): FilterParams {
    const filter: FilterParams = {};
    const f: Record<string, unknown> = {};
    if (this.ids !== null) f['id'] = this.ids.join(',');
    if (this.types !== null) f['type'] = this.types.join(',');
    if (this.entity !== null) f['entity'] = this.entity.join(',');
    if (this.valueAfter !== null) f['value_after'] = this.valueAfter;
    if (this.valueBefore !== null) f['value_before'] = this.valueBefore;
    if (this.createdBy !== null) f['created_by'] = this.createdBy.join(',');
    if (this.createdAt !== null) f['created_at'] = this.createdAt.join(',');
    if (this.entityIds !== null) f['entity_id'] = this.entityIds.join(',');
    if (Object.keys(f).length > 0) filter['filter'] = f;
    return this.buildPagesFilter(filter);
  }
}
