import { BaseApiModel } from './BaseApiModel';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';

export class TagModel extends BaseApiModel {
  protected id: number | null = null;
  protected name: string | null = null;
  protected color: string | null = null;
  protected requestId: string | null = null;

  getId() { return this.id; }
  setId(id: number) { this.id = id; return this; }
  getName() { return this.name; }
  setName(name: string | null) { this.name = name; return this; }
  getColor() { return this.color; }
  setColor(color: string | null) { this.color = color; return this; }
  getRequestId() { return this.requestId; }
  setRequestId(id: string | null) { this.requestId = id; return this; }

  fromArray(data: Record<string, unknown>): this {
    if (!data['id'] && !data['name']) {
      throw new InvalidArgumentException('Tag id and name are empty in ' + JSON.stringify(data));
    }
    if (data['id']) this.setId(Number(data['id']));
    if (data['name'] !== undefined && data['name'] !== null) this.setName(String(data['name']));
    if (data['color'] !== undefined && data['color'] !== null) this.setColor(String(data['color']));
    return this as this;
  }

  toArray(): Record<string, unknown> {
    return { id: this.id, name: this.name, color: this.color };
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    if (this.id !== null) result['id'] = this.id;
    if (this.name !== null) result['name'] = this.name;
    if (this.requestId === null && requestId !== null && requestId !== undefined) this.requestId = String(requestId);
    if (this.requestId !== null) result['request_id'] = this.requestId;
    return result;
  }

  toEntityApi(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    if (this.id !== null) result['id'] = this.id;
    if (this.name !== null) result['name'] = this.name;
    return result;
  }
}
