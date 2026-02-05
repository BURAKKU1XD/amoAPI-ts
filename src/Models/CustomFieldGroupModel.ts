import { BaseApiModel } from './BaseApiModel';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';

/**
 * Custom field group model
 */
export class CustomFieldGroupModel extends BaseApiModel {
  protected id: string | null = null;
  protected name: string | null = null;
  protected isPredefined: boolean | null = null;
  protected sort: number | null = null;
  protected entityType: string | null = null;
  protected fields: Record<string, unknown>[] | null = null;
  protected requestId: string | null = null;

  getId() { return this.id; }
  setId(id: string) { this.id = id; return this; }
  getName() { return this.name; }
  setName(name: string) { this.name = name; return this; }
  getIsPredefined() { return this.isPredefined; }
  setIsPredefined(flag: boolean) { this.isPredefined = flag; return this; }
  getSort() { return this.sort; }
  setSort(sort: number) { this.sort = sort; return this; }
  getEntityType() { return this.entityType; }
  setEntityType(entityType: string | null) { this.entityType = entityType; return this; }
  getFields() { return this.fields; }
  setFields(fields: Record<string, unknown>[] | null) { this.fields = fields; return this; }
  getRequestId() { return this.requestId; }
  setRequestId(id: string | null) { this.requestId = id; return this; }

  fromArray(data: Record<string, unknown>): this {
    if (!data['id']) {
      throw new InvalidArgumentException('Custom field group id is empty in ' + JSON.stringify(data));
    }
    this.setId(String(data['id']));
    if (data['name']) this.setName(String(data['name']));
    if (data['sort'] !== undefined) this.setSort(Number(data['sort']));
    if (data['is_predefined'] !== undefined) this.setIsPredefined(Boolean(data['is_predefined']));
    if (data['entity_type'] !== undefined) this.setEntityType(data['entity_type'] as string | null);
    if (data['fields'] !== undefined) this.setFields(data['fields'] as Record<string, unknown>[] | null);

    return this as this;
  }

  toArray(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      sort: this.sort,
      is_predefined: this.isPredefined,
      entity_type: this.entityType,
      fields: this.fields,
    };
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    if (this.id !== null) result['id'] = this.id;
    if (this.name !== null) result['name'] = this.name;
    if (this.sort !== null) result['sort'] = this.sort;
    if (this.fields !== null) result['fields'] = this.fields;

    if (this.requestId === null && requestId !== null && requestId !== undefined) {
      this.requestId = String(requestId);
    }

    result['request_id'] = this.requestId;

    return result;
  }
}
