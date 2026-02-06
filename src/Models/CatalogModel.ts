import { BaseApiModel } from './BaseApiModel';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';

export class CatalogModel extends BaseApiModel {
  static readonly TYPE_REGULAR = 'regular';
  static readonly TYPE_INVOICES = 'invoices';
  static readonly TYPE_SUPPLIERS = 'suppliers';

  protected id: number | null = null;
  protected name: string | null = null;
  protected createdBy: number | null = null;
  protected updatedBy: number | null = null;
  protected createdAt: number | null = null;
  protected updatedAt: number | null = null;
  protected sort: number | null = null;
  protected type: string | null = null;
  protected canAddElements: boolean | null = null;
  protected canShowInCards: boolean | null = null;
  protected canLinkMultiple: boolean | null = null;
  protected sdkWidgetCode: number | null = null;
  protected accountId: number | null = null;
  protected requestId: string | null = null;

  getId() { return this.id; }
  setId(id: number) { this.id = id; return this; }
  getName() { return this.name; }
  setName(name: string | null) { this.name = name; return this; }
  getCreatedBy() { return this.createdBy; }
  setCreatedBy(id: number | null) { this.createdBy = id; return this; }
  getUpdatedBy() { return this.updatedBy; }
  setUpdatedBy(id: number | null) { this.updatedBy = id; return this; }
  getCreatedAt() { return this.createdAt; }
  setCreatedAt(ts: number | null) { this.createdAt = ts; return this; }
  getUpdatedAt() { return this.updatedAt; }
  setUpdatedAt(ts: number | null) { this.updatedAt = ts; return this; }
  getSort() { return this.sort; }
  setSort(s: number | null) { this.sort = s; return this; }
  getCatalogType() { return this.type; }
  setCatalogType(t: string | null) { this.type = t; return this; }
  getCanAddElements() { return this.canAddElements; }
  setCanAddElements(f: boolean | null) { this.canAddElements = f; return this; }
  getCanShowInCards() { return this.canShowInCards; }
  setCanShowInCards(f: boolean | null) { this.canShowInCards = f; return this; }
  getCanLinkMultiple() { return this.canLinkMultiple; }
  setCanLinkMultiple(f: boolean | null) { this.canLinkMultiple = f; return this; }
  getSdkWidgetCode() { return this.sdkWidgetCode; }
  setSdkWidgetCode(c: number | null) { this.sdkWidgetCode = c; return this; }
  getAccountId() { return this.accountId; }
  setAccountId(id: number | null) { this.accountId = id; return this; }
  getRequestId() { return this.requestId; }
  setRequestId(id: string | null) { this.requestId = id; return this; }

  fromArray(data: Record<string, unknown>): this {
    if (!data['id']) {
      throw new InvalidArgumentException('Catalog id is empty in ' + JSON.stringify(data));
    }
    this.setId(Number(data['id']));
    if (data['name']) this.setName(String(data['name']));
    if (data['created_by'] !== undefined && data['created_by'] !== null) this.setCreatedBy(Number(data['created_by']));
    if (data['updated_by'] !== undefined && data['updated_by'] !== null) this.setUpdatedBy(Number(data['updated_by']));
    if (data['created_at']) this.setCreatedAt(Number(data['created_at']));
    if (data['updated_at']) this.setUpdatedAt(Number(data['updated_at']));
    if (data['sort'] !== undefined && data['sort'] !== null) this.setSort(Number(data['sort']));
    if (data['type'] !== undefined && data['type'] !== null) this.setCatalogType(String(data['type']));
    if (data['can_add_elements'] !== undefined && data['can_add_elements'] !== null) this.setCanAddElements(Boolean(data['can_add_elements']));
    if (data['can_show_in_cards'] !== undefined && data['can_show_in_cards'] !== null) this.setCanShowInCards(Boolean(data['can_show_in_cards']));
    if (data['can_link_multiple'] !== undefined && data['can_link_multiple'] !== null) this.setCanLinkMultiple(Boolean(data['can_link_multiple']));
    if (data['sdk_widget_code'] !== undefined && data['sdk_widget_code'] !== null) this.setSdkWidgetCode(Number(data['sdk_widget_code']));
    if (data['account_id']) this.setAccountId(Number(data['account_id']));
    return this as this;
  }

  toArray(): Record<string, unknown> {
    return {
      id: this.id, name: this.name,
      created_by: this.createdBy, updated_by: this.updatedBy,
      created_at: this.createdAt, updated_at: this.updatedAt,
      sort: this.sort, type: this.type,
      can_add_elements: this.canAddElements,
      can_show_in_cards: this.canShowInCards,
      can_link_multiple: this.canLinkMultiple,
      sdk_widget_code: this.sdkWidgetCode,
      account_id: this.accountId,
    };
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    if (this.id !== null) result['id'] = this.id;
    if (this.name !== null) result['name'] = this.name;
    if (this.canAddElements !== null) result['can_add_elements'] = this.canAddElements;
    if (this.canShowInCards !== null) result['can_show_in_cards'] = this.canShowInCards;
    if (this.canLinkMultiple !== null) result['can_link_multiple'] = this.canLinkMultiple;
    if (this.sdkWidgetCode !== null) result['sdk_widget_code'] = this.sdkWidgetCode;
    if (this.createdBy !== null) result['created_by'] = this.createdBy;
    if (this.updatedBy !== null) result['updated_by'] = this.updatedBy;
    if (this.requestId === null && requestId !== null && requestId !== undefined) this.requestId = String(requestId);
    if (this.requestId !== null) result['request_id'] = this.requestId;
    return result;
  }
}
