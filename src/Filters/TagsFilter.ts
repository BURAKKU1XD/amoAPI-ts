import { BaseEntityFilter, FilterParams } from './BaseEntityFilter';

export class TagsFilter extends BaseEntityFilter {
  private ids: number[] | null = null;
  private query: string | null = null;
  private name: string | null = null;

  getIds() { return this.ids; }
  setIds(ids: number[]) { this.ids = this.parseArrayOrNumberFilter(ids); return this; }
  getQuery() { return this.query; }
  setQuery(q: string | null) { if (q) this.query = String(q); return this; }
  getName() { return this.name; }
  setName(n: string | null) { if (n) this.name = String(n); return this; }

  buildFilter(): FilterParams {
    const filter: FilterParams = {};
    const f: Record<string, unknown> = {};
    if (this.ids !== null) f['id'] = this.ids;
    if (this.name !== null) f['name'] = this.name;
    if (Object.keys(f).length > 0) filter['filter'] = f;
    if (this.query !== null) filter['query'] = this.query;
    return this.buildPagesFilter(filter);
  }
}
