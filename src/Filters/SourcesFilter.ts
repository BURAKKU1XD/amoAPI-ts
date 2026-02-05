import { BaseEntityFilter, FilterParams } from './BaseEntityFilter';

export class SourcesFilter extends BaseEntityFilter {
  private ids: number[] | null = null;
  private externalIds: string[] | null = null;

  getIds() { return this.ids; }
  setIds(ids: number[]) { this.ids = this.parseArrayOrNumberFilter(ids); return this; }
  getExternalIds() { return this.externalIds; }
  setExternalIds(ids: string[]) { this.externalIds = this.parseArrayOrStringFilter(ids); return this; }

  buildFilter(): FilterParams {
    const filter: FilterParams = {};
    const f: Record<string, unknown> = {};
    if (this.ids !== null) f['id'] = this.ids;
    if (this.externalIds !== null) f['external_id'] = this.externalIds;
    if (Object.keys(f).length > 0) filter['filter'] = f;
    return this.buildPagesFilter(filter);
  }
}
