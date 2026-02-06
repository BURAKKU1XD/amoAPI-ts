import { BaseEntityFilter, FilterParams } from './BaseEntityFilter';

export class FilesFilter extends BaseEntityFilter {
  private ids: number[] | null = null;

  getIds() { return this.ids; }
  setIds(ids: number[]) { this.ids = this.parseArrayOrNumberFilter(ids); return this; }

  buildFilter(): FilterParams {
    const filter: FilterParams = {};
    if (this.ids !== null) filter['filter'] = { id: this.ids };
    return this.buildPagesFilter(filter);
  }
}
