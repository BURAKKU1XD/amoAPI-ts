import { BaseEntityFilter, FilterParams } from './BaseEntityFilter';

export class ChatLinksFilter extends BaseEntityFilter {
  private entityType: string | null = null;
  private entityId: number | null = null;

  getEntityType() { return this.entityType; }
  setEntityType(t: string | null) { this.entityType = t; return this; }
  getEntityId() { return this.entityId; }
  setEntityId(id: number | null) { this.entityId = id; return this; }

  buildFilter(): FilterParams {
    const filter: FilterParams = {};
    if (this.entityType !== null) filter['entity_type'] = this.entityType;
    if (this.entityId !== null) filter['entity_id'] = this.entityId;
    return filter;
  }
}
