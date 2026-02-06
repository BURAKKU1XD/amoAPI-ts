import { BaseApiModel } from './BaseApiModel';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';

const EMBEDDED = '_embedded';

export class CatalogElementModel extends BaseApiModel {
  static readonly INVOICE_LINK = 'invoice_link';
  static readonly SUPPLIER_FIELD_VALUES = 'supplier_field_values';

  protected id: number | null = null;
  protected name: string | null = null;
  protected currencyId: number | null = null;
  protected catalogId: number | null = null;
  protected createdBy: number | null = null;
  protected updatedBy: number | null = null;
  protected createdAt: number | null = null;
  protected updatedAt: number | null = null;
  protected needUpdateUpdatedAt: boolean = false;
  protected customFieldsValues: Record<string, unknown>[] | null = null;
  protected isDeleted: boolean | null = null;
  protected quantity: number | null = null;
  protected priceId: number | null = null;
  protected accountId: number | null = null;
  protected invoiceLink: string | null = null;
  protected invoiceWarning: Record<string, unknown> | null = null;
  protected requestId: string | null = null;

  getType(): string { return EntityTypes.CATALOG_ELEMENTS_FULL; }

  getId() { return this.id; }
  setId(id: number) { this.id = id; return this; }
  getName() { return this.name; }
  setName(name: string | null) { this.name = name; return this; }
  getCurrencyId() { return this.currencyId; }
  setCurrencyId(id: number | null) { this.currencyId = id; return this; }
  getCatalogId() { return this.catalogId; }
  setCatalogId(id: number | null) { this.catalogId = id; return this; }
  getCreatedBy() { return this.createdBy; }
  setCreatedBy(id: number | null) { this.createdBy = id; return this; }
  getUpdatedBy() { return this.updatedBy; }
  setUpdatedBy(id: number | null) { this.updatedBy = id; return this; }
  getCreatedAt() { return this.createdAt; }
  setCreatedAt(ts: number | null) { this.createdAt = ts; return this; }
  getUpdatedAt() { return this.updatedAt; }
  setUpdatedAt(ts: number | null) { this.updatedAt = ts; this.needUpdateUpdatedAt = true; return this; }
  getCustomFieldsValues() { return this.customFieldsValues; }
  setCustomFieldsValues(v: Record<string, unknown>[] | null) { this.customFieldsValues = v; return this; }
  getIsDeleted() { return this.isDeleted; }
  setIsDeleted(f: boolean | null) { this.isDeleted = f; return this; }
  getQuantity() { return this.quantity; }
  setQuantity(q: number) {
    if (typeof q !== 'number') throw new InvalidArgumentException('Quantity must be a number');
    this.quantity = q; return this;
  }
  getPriceId() { return this.priceId; }
  setPriceId(id: number | null) { this.priceId = id; return this; }
  getAccountId() { return this.accountId; }
  setAccountId(id: number | null) { this.accountId = id; return this; }
  getInvoiceLink() { return this.invoiceLink; }
  setInvoiceLink(l: string | null) { this.invoiceLink = l; return this; }
  getInvoiceWarning() { return this.invoiceWarning; }
  setInvoiceWarning(w: Record<string, unknown> | null) { this.invoiceWarning = w; return this; }
  getRequestId() { return this.requestId; }
  setRequestId(id: string | null) { this.requestId = id; return this; }

  static getAvailableWith(): string[] {
    return [CatalogElementModel.INVOICE_LINK, CatalogElementModel.SUPPLIER_FIELD_VALUES];
  }

  fromArray(data: Record<string, unknown>): this {
    if (!data['id']) {
      throw new InvalidArgumentException('CatalogElement id is empty in ' + JSON.stringify(data));
    }
    this.setId(Number(data['id']));
    if (data['name']) this.setName(String(data['name']));
    if (data['created_by'] !== undefined && data['created_by'] !== null) this.setCreatedBy(Number(data['created_by']));
    if (data['updated_by'] !== undefined && data['updated_by'] !== null) this.setUpdatedBy(Number(data['updated_by']));
    if (data['currency_id'] !== undefined && data['currency_id'] !== null) this.setCurrencyId(Number(data['currency_id']));
    if (data['created_at']) this.setCreatedAt(Number(data['created_at']));
    if (data['updated_at']) this.setUpdatedAt(Number(data['updated_at']));
    if (data['catalog_id']) this.setCatalogId(Number(data['catalog_id']));
    if (data['is_deleted'] !== undefined && data['is_deleted'] !== null) this.setIsDeleted(Boolean(data['is_deleted']));
    if (data['invoice_link'] !== undefined && data['invoice_link'] !== null) this.setInvoiceLink(String(data['invoice_link']));
    if (data['custom_fields_values']) this.setCustomFieldsValues(data['custom_fields_values'] as Record<string, unknown>[]);
    if (data['account_id']) this.setAccountId(Number(data['account_id']));

    const embedded = data[EMBEDDED] as Record<string, unknown> | undefined;
    if (embedded && embedded['warning']) {
      this.setInvoiceWarning(embedded['warning'] as Record<string, unknown>);
    }

    // Link metadata support
    if (data['to_element_id'] !== undefined) this.setId(Number(data['to_element_id']));
    const metadata = data['metadata'] as Record<string, unknown> | undefined;
    if (metadata) {
      if (metadata['quantity'] !== undefined) this.setQuantity(Number(metadata['quantity']));
      if (metadata['price_id'] !== undefined) this.setPriceId(Number(metadata['price_id']));
      if (metadata['catalog_id'] !== undefined) this.setCatalogId(Number(metadata['catalog_id']));
    }

    return this as this;
  }

  toArray(): Record<string, unknown> {
    const result: Record<string, unknown> = {
      id: this.id, name: this.name,
      created_by: this.createdBy, updated_by: this.updatedBy,
      created_at: this.createdAt, updated_at: this.updatedAt,
      catalog_id: this.catalogId, is_deleted: this.isDeleted,
      custom_fields_values: this.customFieldsValues,
      account_id: this.accountId, invoice_link: this.invoiceLink,
      metadata: {
        quantity: this.quantity, catalog_id: this.catalogId,
        price_id: this.priceId,
      },
      warning: this.invoiceWarning,
    };
    if (this.currencyId !== null) result['currency_id'] = this.currencyId;
    return result;
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    if (this.id !== null) result['id'] = this.id;
    if (this.currencyId !== null) result['currency_id'] = this.currencyId;
    if (this.name !== null) result['name'] = this.name;
    if (this.createdBy !== null) result['created_by'] = this.createdBy;
    if (this.updatedBy !== null) result['updated_by'] = this.updatedBy;
    if (this.createdAt !== null) result['created_at'] = this.createdAt;
    if (this.needUpdateUpdatedAt && this.updatedAt !== null) result['updated_at'] = this.updatedAt;
    if (this.customFieldsValues !== null) result['custom_fields_values'] = this.customFieldsValues;
    if (this.requestId === null && requestId !== null && requestId !== undefined) this.requestId = String(requestId);
    result['request_id'] = this.requestId;
    return result;
  }
}
