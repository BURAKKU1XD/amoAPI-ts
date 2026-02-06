import { BaseApiModel } from './BaseApiModel';

export class LinkModel extends BaseApiModel {
  protected entityId: number | null = null;
  protected entityType: string | null = null;
  protected toEntityId: number | null = null;
  protected toEntityType: string | null = null;
  protected metadata: Record<string, unknown> | null = null;

  getEntityId() { return this.entityId; }
  setEntityId(id: number | null) { this.entityId = id; return this; }
  getEntityType() { return this.entityType; }
  setEntityType(type: string | null) { this.entityType = type; return this; }
  getToEntityId() { return this.toEntityId; }
  setToEntityId(id: number | null) { this.toEntityId = id; return this; }
  getToEntityType() { return this.toEntityType; }
  setToEntityType(type: string | null) { this.toEntityType = type; return this; }
  getMetadata() { return this.metadata; }
  setMetadata(m: Record<string, unknown> | null) { this.metadata = m; return this; }

  fromArray(data: Record<string, unknown>): this {
    this.setEntityId(data['entity_id'] !== undefined ? Number(data['entity_id']) : null);
    this.setEntityType(data['entity_type'] !== undefined ? String(data['entity_type']) : null);
    this.setToEntityType(data['to_entity_type'] !== undefined ? String(data['to_entity_type']) : null);
    this.setToEntityId(data['to_entity_id'] !== undefined ? Number(data['to_entity_id']) : null);
    this.setMetadata((data['metadata'] as Record<string, unknown>) ?? null);
    return this as this;
  }

  toArray(): Record<string, unknown> {
    return {
      entity_type: this.entityType, entity_id: this.entityId,
      to_entity_type: this.toEntityType, to_entity_id: this.toEntityId,
      metadata: this.metadata,
    };
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    return this.toArray();
  }
}
