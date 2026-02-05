import { BaseEntityFilter, FilterParams } from './BaseEntityFilter';

export class UnsortedSummaryFilter extends BaseEntityFilter {
  private uids: string[] | null = null;
  private pipelineId: number | null = null;

  getUids() { return this.uids; }
  setUids(uids: string[] | null) { this.uids = uids ? this.parseArrayOrStringFilter(uids) : null; return this; }
  getPipelineId() { return this.pipelineId; }
  setPipelineId(id: number | null) { this.pipelineId = id; return this; }

  buildFilter(): FilterParams {
    const filter: FilterParams = {};
    const f: Record<string, unknown> = {};
    if (this.uids !== null) f['uid'] = this.uids;
    if (this.pipelineId !== null) f['pipeline_id'] = this.pipelineId;
    if (Object.keys(f).length > 0) filter['filter'] = f;
    return this.buildPagesFilter(filter);
  }
}
