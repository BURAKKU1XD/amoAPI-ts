import { BaseApiModel } from './BaseApiModel';

/**
 * Status model for pipeline statuses
 */
export class StatusModel extends BaseApiModel {
  static readonly COLORS = [
    '#fffeb2', '#fffd7f', '#fff000', '#ffeab2', '#ffdc7f',
    '#ffce5a', '#ffdbdb', '#ffc8c8', '#ff8f92', '#d6eaff',
    '#c1e0ff', '#98cbff', '#ebffb1', '#deff81', '#87f2c0',
    '#f9deff', '#f3beff', '#ccc8f9', '#eb93ff', '#f2f3f4',
    '#e6e8ea',
  ];

  static readonly DESCRIPTIONS = 'descriptions';

  protected id: number | null = null;
  protected name: string | null = null;
  protected sort: number | null = null;
  protected accountId: number | null = null;
  protected isEditable: boolean | null = null;
  protected color: string | null = null;
  protected type: number | null = null;
  protected pipelineId: number | null = null;
  protected descriptions: Record<string, unknown>[] | null = null;
  protected requestId: string | null = null;

  getId() { return this.id; }
  setId(id: number) { this.id = id; return this; }
  getName() { return this.name; }
  setName(name: string) { this.name = name; return this; }
  getSort() { return this.sort; }
  setSort(sort: number | null) { this.sort = sort; return this; }
  getAccountId() { return this.accountId; }
  setAccountId(accountId: number | null) { this.accountId = accountId; return this; }
  getIsEditable() { return this.isEditable; }
  setIsEditable(isEditable: boolean | null) { this.isEditable = isEditable; return this; }
  getColor() { return this.color; }
  setColor(color: string | null) { this.color = color; return this; }
  getType() { return this.type; }
  setType(type: number | null) { this.type = type; return this; }
  getPipelineId() { return this.pipelineId; }
  setPipelineId(pipelineId: number | null) { this.pipelineId = pipelineId; return this; }
  getDescriptions() { return this.descriptions; }
  setDescriptions(descriptions: Record<string, unknown>[] | null) { this.descriptions = descriptions; return this; }
  getRequestId() { return this.requestId; }
  setRequestId(id: string | null) { this.requestId = id; return this; }

  static getAvailableWith(): string[] {
    return [StatusModel.DESCRIPTIONS];
  }

  fromArray(data: Record<string, unknown>): this {
    this.setId(Number(data['id']));
    if (data['name']) this.setName(String(data['name']));
    if (data['sort'] !== undefined) this.setSort(Number(data['sort']));
    if (data['account_id'] !== undefined) this.setAccountId(Number(data['account_id']));
    if (data['is_editable'] !== undefined) this.setIsEditable(Boolean(data['is_editable']));
    if (data['pipeline_id'] !== undefined) this.setPipelineId(Number(data['pipeline_id']));
    if (data['color'] !== undefined) this.setColor(data['color'] as string | null);
    if (data['type'] !== undefined) this.setType(Number(data['type']));
    if (data[StatusModel.DESCRIPTIONS]) {
      this.setDescriptions(data[StatusModel.DESCRIPTIONS] as Record<string, unknown>[]);
    }

    return this as this;
  }

  toArray(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      sort: this.sort,
      account_id: this.accountId,
      type: this.type,
      color: this.color,
      is_editable: this.isEditable,
      pipeline_id: this.pipelineId,
      descriptions: this.descriptions,
    };
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    if (this.id !== null && !this.pipelineId) result['id'] = this.id;
    if (this.name !== null) result['name'] = this.name;
    if (this.sort !== null) result['sort'] = this.sort;
    if (this.color !== null) result['color'] = this.color;

    if (this.requestId === null && requestId !== null && requestId !== undefined) {
      this.requestId = String(requestId);
    }

    if (this.descriptions !== null) {
      result[StatusModel.DESCRIPTIONS] = this.descriptions;
    }

    result['request_id'] = this.requestId;

    return result;
  }
}
