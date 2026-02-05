import { BaseEntityFilter, FilterParams } from './BaseEntityFilter';

export class CatalogElementsFilter extends BaseEntityFilter {
  private ids: number[] | null = null;
  private query: string | null = null;

  getIds() { return this.ids; }
  setIds(ids: number[]) { this.ids = this.parseArrayOrNumberFilter(ids); return this; }
  getQuery() { return this.query; }
  setQuery(q: string | null) { if (q) this.query = String(q); return this; }

  buildFilter(): FilterParams {
    const filter: FilterParams = {};
    if (this.ids !== null) filter['id'] = this.ids;
    if (this.query !== null) filter['query'] = this.query;
    return this.buildPagesFilter(filter);
  }
}
