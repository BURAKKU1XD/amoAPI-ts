import { BaseEntityFilter, FilterParams } from './BaseEntityFilter';

export class CustomFieldsFilter extends BaseEntityFilter {
  private types: string[] | null = null;
  private ids: number[] | null = null;
  private order: Record<string, string> | null = null;

  getIds() { return this.ids; }
  setIds(ids: number[]) { this.ids = this.parseArrayOrNumberFilter(ids); return this; }
  getTypes() { return this.types; }
  setTypes(types: string[] | null) { this.types = types ? this.parseArrayOrStringFilter(types) : null; return this; }
  getOrder() { return this.order; }
  setOrder(o: Record<string, string>) { this.order = o; return this; }

  buildFilter(): FilterParams {
    const filter: FilterParams = {};
    const f: Record<string, unknown> = {};
    if (this.ids !== null && this.ids.length > 0) f['id'] = this.ids;
    if (this.types !== null && this.types.length > 0) f['type'] = this.types;
    if (Object.keys(f).length > 0) filter['filter'] = f;
    if (this.order !== null) filter['order'] = this.order;
    return this.buildPagesFilter(filter);
  }
}
