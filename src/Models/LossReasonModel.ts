import { BaseApiModel } from './BaseApiModel';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';

/**
 * Loss reason model
 */
export class LossReasonModel extends BaseApiModel {
  protected id: number | null = null;
  protected name: string | null = null;
  protected sort: number | null = null;
  protected createdAt: number | null = null;
  protected updatedAt: number | null = null;
  protected requestId: string | null = null;

  getId() { return this.id; }
  setId(id: number) { this.id = id; return this; }
  getName() { return this.name; }
  setName(name: string) { this.name = name; return this; }
  getSort() { return this.sort; }
  setSort(sort: number) { this.sort = sort; return this; }
  getCreatedAt() { return this.createdAt; }
  setCreatedAt(timestamp: number) { this.createdAt = timestamp; return this; }
  getUpdatedAt() { return this.updatedAt; }
  setUpdatedAt(timestamp: number) { this.updatedAt = timestamp; return this; }
  getRequestId() { return this.requestId; }
  setRequestId(id: string | null) { this.requestId = id; return this; }

  fromArray(data: Record<string, unknown>): this {
    if (!data['id']) {
      throw new InvalidArgumentException('Loss reason id is empty in ' + JSON.stringify(data));
    }
    this.setId(Number(data['id']));
    if (data['name']) this.setName(String(data['name']));
    if (data['sort'] !== undefined) this.setSort(Number(data['sort']));
    if (data['created_at']) this.setCreatedAt(Number(data['created_at']));
    if (data['updated_at']) this.setUpdatedAt(Number(data['updated_at']));

    return this as this;
  }

  toArray(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      sort: this.sort,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    const result: Record<string, unknown> = {
      name: this.name,
    };

    if (this.requestId === null && requestId !== null && requestId !== undefined) {
      this.requestId = String(requestId);
    }

    result['request_id'] = this.requestId;

    if (this.sort !== null) result['sort'] = this.sort;

    return result;
  }
}
