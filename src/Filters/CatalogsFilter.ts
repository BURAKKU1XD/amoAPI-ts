import { BaseEntityFilter, FilterParams } from './BaseEntityFilter';

export class CatalogsFilter extends BaseEntityFilter {
  private type: string | null = null;

  getType() { return this.type; }
  setType(t: string | null) { this.type = t; return this; }

  buildFilter(): FilterParams {
    const filter: FilterParams = {};
    if (this.type !== null) filter['type'] = this.type;
    return filter;
  }
}
