import { BaseEntityFilter, FilterParams, RangeFilter } from './BaseEntityFilter';

export class NotesFilter extends BaseEntityFilter {
  private ids: number[] | null = null;
  private entityIds: number[] | null = null;
  private noteTypes: string[] = [];
  private updatedAt: number | RangeFilter | null = null;
  private order: Record<string, string> | null = null;

  getIds() { return this.ids; }
  setIds(ids: number[]) { this.ids = this.parseArrayOrNumberFilter(ids); return this; }
  getEntityIds() { return this.entityIds; }
  setEntityIds(v: number[] | null) { this.entityIds = v; return this; }
  getNoteTypes() { return this.noteTypes; }
  setNoteTypes(types: string[]) { if (types.length > 0) this.noteTypes = types; return this; }
  getUpdatedAt() { return this.updatedAt; }
  setUpdatedAt(v: number | RangeFilter | null) { this.updatedAt = this.parseIntOrIntRangeFilter(v); return this; }
  getOrder() { return this.order; }
  setOrder(o: Record<string, string>) { this.order = o; return this; }

  buildFilter(): FilterParams {
    const filter: FilterParams = {};
    const f: Record<string, unknown> = {};
    if (this.ids !== null) f['id'] = this.ids;
    if (this.noteTypes.length > 0) f['note_type'] = this.noteTypes;
    if (this.updatedAt !== null) f['updated_at'] = this.updatedAt;
    if (this.entityIds !== null && this.entityIds.length > 0) f['entity_id'] = this.entityIds;
    if (Object.keys(f).length > 0) filter['filter'] = f;
    if (this.order !== null) filter['order'] = this.order;
    return this.buildPagesFilter(filter);
  }
}
