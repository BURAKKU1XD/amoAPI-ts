import { BaseEntityFilter, FilterParams, RangeFilter, BaseRangeFilter } from './BaseEntityFilter';

export class CompaniesFilter extends BaseEntityFilter {
  private ids: number[] | null = null;
  private names: string[] | null = null;
  private createdBy: number[] | null = null;
  private updatedBy: number[] | null = null;
  private responsibleUserId: number[] | null = null;
  private createdAt: number | RangeFilter | null = null;
  private updatedAt: number | RangeFilter | null = null;
  private closestTaskAt: number | RangeFilter | null = null;
  private customFieldsValues: Record<string, unknown> | null = null;
  private query: string | null = null;
  private order: Record<string, string> | null = null;

  getIds() { return this.ids; }
  setIds(ids: number | number[]) { this.ids = this.parseArrayOrNumberFilter(ids); return this; }
  getNames() { return this.names; }
  setNames(names: string | string[]) { this.names = this.parseArrayOrStringFilter(names); return this; }
  getCreatedBy() { return this.createdBy; }
  setCreatedBy(v: number | number[]) { this.createdBy = this.parseArrayOrNumberFilter(v); return this; }
  getUpdatedBy() { return this.updatedBy; }
  setUpdatedBy(v: number | number[]) { this.updatedBy = this.parseArrayOrNumberFilter(v); return this; }
  getResponsibleUserId() { return this.responsibleUserId; }
  setResponsibleUserId(v: number | number[]) { this.responsibleUserId = this.parseArrayOrNumberFilter(v); return this; }
  getCreatedAt() { return this.createdAt; }
  setCreatedAt(v: number | RangeFilter | null) { this.createdAt = this.parseIntOrIntRangeFilter(v); return this; }
  getUpdatedAt() { return this.updatedAt; }
  setUpdatedAt(v: number | RangeFilter | null) { this.updatedAt = this.parseIntOrIntRangeFilter(v); return this; }
  getClosestTaskAt() { return this.closestTaskAt; }
  setClosestTaskAt(v: number | RangeFilter | null) { this.closestTaskAt = this.parseIntOrIntRangeFilter(v); return this; }
  getCustomFieldsValues() { return this.customFieldsValues; }
  setCustomFieldsValues(values: Record<string, unknown>) {
    const cf: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(values)) {
      cf[k] = v instanceof BaseRangeFilter ? v.toFilter() : Array.isArray(v) ? v : [v];
    }
    this.customFieldsValues = cf;
    return this;
  }
  getQuery() { return this.query; }
  setQuery(q: string) { if (q) this.query = String(q); return this; }
  getOrder() { return this.order; }
  setOrder(o: Record<string, string>) { this.order = o; return this; }

  buildFilter(): FilterParams {
    const filter: FilterParams = {};
    const f: Record<string, unknown> = {};
    if (this.ids !== null) f['id'] = this.ids;
    if (this.names !== null) f['name'] = this.names;
    if (this.createdBy !== null) f['created_by'] = this.createdBy;
    if (this.updatedBy !== null) f['updated_by'] = this.updatedBy;
    if (this.responsibleUserId !== null) f['responsible_user_id'] = this.responsibleUserId;
    if (this.createdAt !== null) f['created_at'] = this.createdAt;
    if (this.updatedAt !== null) f['updated_at'] = this.updatedAt;
    if (this.closestTaskAt !== null) f['closest_task_at'] = this.closestTaskAt;
    if (this.customFieldsValues !== null) f['custom_fields_values'] = this.customFieldsValues;
    if (Object.keys(f).length > 0) filter['filter'] = f;
    if (this.query !== null) filter['query'] = this.query;
    if (this.order !== null) filter['order'] = this.order;
    return this.buildPagesFilter(filter);
  }
}
