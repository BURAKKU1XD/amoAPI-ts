import { BaseEntityFilter, FilterParams } from './BaseEntityFilter';

export class EntitiesLinksFilter extends BaseEntityFilter {
  private entityType: string | null = null;
  private entityIds: number[] | null = null;

  getEntityType() { return this.entityType; }
  setEntityType(t: string | null) { this.entityType = t; return this; }
  getEntityIds() { return this.entityIds; }
  setEntityIds(ids: number[]) { this.entityIds = this.parseArrayOrNumberFilter(ids); return this; }

  buildFilter(): FilterParams {
    const filter: FilterParams = {};
    const f: Record<string, unknown> = {};
    if (this.entityType !== null) f['to_entity_type'] = this.entityType;
    if (this.entityIds !== null) f['to_entity_id'] = this.entityIds;
    if (Object.keys(f).length > 0) filter['filter'] = f;
    return this.buildPagesFilter(filter);
  }
}
