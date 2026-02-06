import { BaseEntityFilter, FilterParams } from './BaseEntityFilter';

export class UnsortedFilter extends BaseEntityFilter {
  private uids: string[] | null = null;
  private category: string[] | null = null;
  private pipelineId: number | null = null;
  private order: Record<string, string> | null = null;

  getUids() { return this.uids; }
  setUids(uids: string[] | null) { this.uids = uids ? this.parseArrayOrStringFilter(uids) : null; return this; }
  getCategory() { return this.category; }
  setCategory(c: string | string[]) { this.category = this.parseArrayOrStringFilter(c); return this; }
  getPipelineId() { return this.pipelineId; }
  setPipelineId(id: number | null) { this.pipelineId = id; return this; }
  getOrder() { return this.order; }
  setOrder(o: Record<string, string>) { this.order = o; return this; }

  buildFilter(): FilterParams {
    const filter: FilterParams = {};
    const f: Record<string, unknown> = {};
    if (this.uids !== null) f['uid'] = this.uids;
    if (this.category !== null) f['category'] = this.category;
    if (this.pipelineId !== null) f['pipeline_id'] = this.pipelineId;
    if (Object.keys(f).length > 0) filter['filter'] = f;
    if (this.order !== null) filter['order'] = this.order;
    return this.buildPagesFilter(filter);
  }
}
