import { BaseApiModel } from './BaseApiModel';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';

const EMBEDDED = '_embedded';

/**
 * Customer model
 */
export class CustomerModel extends BaseApiModel {
  static readonly CATALOG_ELEMENTS = 'catalog_elements';
  static readonly CONTACTS = 'contacts';
  static readonly COMPANIES = 'companies';
  static readonly GROUP_ID = 'group_id';

  protected id: number | null = null;
  protected name: string | null = null;
  protected nextPrice: number | null = null;
  protected nextDate: number | null = null;
  protected responsibleUserId: number | null = null;
  protected createdBy: number | null = null;
  protected updatedBy: number | null = null;
  protected createdAt: number | null = null;
  protected updatedAt: number | null = null;
  protected accountId: number | null = null;
  protected statusId: number | null = null;
  protected periodicity: number | null = null;
  protected closestTaskAt: number | null = null;
  protected ltv: number | null = null;
  protected purchasesCount: number | null = null;
  protected averageCheck: number | null = null;
  protected segments: Record<string, unknown>[] | null = null;
  protected isDeleted: boolean | null = null;
  protected tags: Record<string, unknown>[] | null = null;
  protected customFieldsValues: Record<string, unknown>[] | null = null;
  protected contacts: Record<string, unknown>[] | null = null;
  protected company: Record<string, unknown> | null = null;
  protected catalogElementsLinks: Record<string, unknown>[] | null = null;
  protected groupId: number | null = null;
  protected requestId: string | null = null;

  getType(): string { return EntityTypes.CUSTOMERS; }

  getId() { return this.id; }
  setId(id: number) { this.id = id; return this; }
  getName() { return this.name; }
  setName(name: string | null) { this.name = name; return this; }
  getNextPrice() { return this.nextPrice; }
  setNextPrice(nextPrice: number | null) { this.nextPrice = nextPrice; return this; }
  getNextDate() { return this.nextDate; }
  setNextDate(nextDate: number | null) { this.nextDate = nextDate; return this; }
  getResponsibleUserId() { return this.responsibleUserId; }
  setResponsibleUserId(userId: number | null) { this.responsibleUserId = userId; return this; }
  getCreatedBy() { return this.createdBy; }
  setCreatedBy(userId: number | null) { this.createdBy = userId; return this; }
  getUpdatedBy() { return this.updatedBy; }
  setUpdatedBy(userId: number | null) { this.updatedBy = userId; return this; }
  getCreatedAt() { return this.createdAt; }
  setCreatedAt(timestamp: number | null) { this.createdAt = timestamp; return this; }
  getUpdatedAt() { return this.updatedAt; }
  setUpdatedAt(timestamp: number | null) { this.updatedAt = timestamp; return this; }
  getAccountId() { return this.accountId; }
  setAccountId(id: number | null) { this.accountId = id; return this; }
  getStatusId() { return this.statusId; }
  setStatusId(statusId: number | null) { this.statusId = statusId; return this; }
  getPeriodicity() { return this.periodicity; }
  setPeriodicity(periodicity: number | null) { this.periodicity = periodicity; return this; }
  getClosestTaskAt() { return this.closestTaskAt; }
  setClosestTaskAt(timestamp: number | null) { this.closestTaskAt = timestamp; return this; }
  getLtv() { return this.ltv; }
  setLtv(ltv: number | null) { this.ltv = ltv; return this; }
  getPurchasesCount() { return this.purchasesCount; }
  setPurchasesCount(purchasesCount: number | null) { this.purchasesCount = purchasesCount; return this; }
  getAverageCheck() { return this.averageCheck; }
  setAverageCheck(averageCheck: number | null) { this.averageCheck = averageCheck; return this; }
  getSegments() { return this.segments; }
  setSegments(segments: Record<string, unknown>[] | null) { this.segments = segments; return this; }
  getIsDeleted() { return this.isDeleted; }
  setIsDeleted(flag: boolean | null) { this.isDeleted = flag; return this; }
  getTags() { return this.tags; }
  setTags(tags: Record<string, unknown>[] | null) { this.tags = tags; return this; }
  getCustomFieldsValues() { return this.customFieldsValues; }
  setCustomFieldsValues(values: Record<string, unknown>[] | null) { this.customFieldsValues = values; return this; }
  getContacts() { return this.contacts; }
  setContacts(contacts: Record<string, unknown>[] | null) { this.contacts = contacts; return this; }
  getCompany() { return this.company; }
  setCompany(company: Record<string, unknown> | null) { this.company = company; return this; }
  getCatalogElementsLinks() { return this.catalogElementsLinks; }
  setCatalogElementsLinks(catalogElements: Record<string, unknown>[] | null) { this.catalogElementsLinks = catalogElements; return this; }
  getGroupId() { return this.groupId; }
  setGroupId(groupId: number | null) { this.groupId = groupId; return this; }
  getRequestId() { return this.requestId; }
  setRequestId(id: string | null) { this.requestId = id; return this; }

  static getAvailableWith(): string[] {
    return [
      CustomerModel.CATALOG_ELEMENTS,
      CustomerModel.COMPANIES,
      CustomerModel.CONTACTS,
      CustomerModel.GROUP_ID,
    ];
  }

  fromArray(data: Record<string, unknown>): this {
    if (!data['id']) {
      throw new InvalidArgumentException('Customer id is empty in ' + JSON.stringify(data));
    }
    this.setId(Number(data['id']));
    if (data['name']) this.setName(String(data['name']));
    if (data['next_price'] !== undefined && data['next_price'] !== null) this.setNextPrice(Number(data['next_price']));
    if (data['next_date'] !== undefined && data['next_date'] !== null) this.setNextDate(Number(data['next_date']));
    if (data['responsible_user_id'] !== undefined && data['responsible_user_id'] !== null) this.setResponsibleUserId(Number(data['responsible_user_id']));
    if (data['status_id']) this.setStatusId(Number(data['status_id']));
    if (data['periodicity'] !== undefined && data['periodicity'] !== null) this.setPeriodicity(Number(data['periodicity']));
    if (data['ltv'] !== undefined && data['ltv'] !== null) this.setLtv(Number(data['ltv']));
    if (data['purchases_count'] !== undefined && data['purchases_count'] !== null) this.setPurchasesCount(Number(data['purchases_count']));
    if (data['average_check'] !== undefined && data['average_check'] !== null) this.setAverageCheck(Number(data['average_check']));
    if (data['custom_fields_values']) this.setCustomFieldsValues(data['custom_fields_values'] as Record<string, unknown>[]);
    if (data['created_by'] !== undefined && data['created_by'] !== null) this.setCreatedBy(Number(data['created_by']));
    if (data['updated_by'] !== undefined && data['updated_by'] !== null) this.setUpdatedBy(Number(data['updated_by']));
    if (data['created_at']) this.setCreatedAt(Number(data['created_at']));
    if (data['updated_at']) this.setUpdatedAt(Number(data['updated_at']));
    if (data['closest_task_at']) this.setClosestTaskAt(Number(data['closest_task_at']) > 0 ? Number(data['closest_task_at']) : null);
    if (data['is_deleted'] !== undefined && data['is_deleted'] !== null) this.setIsDeleted(Boolean(data['is_deleted']));
    if (data['account_id']) this.setAccountId(Number(data['account_id']));
    if (data['group_id'] !== undefined && data['group_id'] !== null) this.setGroupId(Number(data['group_id']));

    const embedded = data[EMBEDDED] as Record<string, unknown> | undefined;
    if (embedded) {
      if (embedded['tags']) this.setTags(embedded['tags'] as Record<string, unknown>[]);
      if (embedded[EntityTypes.CUSTOMERS_SEGMENTS]) this.setSegments(embedded[EntityTypes.CUSTOMERS_SEGMENTS] as Record<string, unknown>[]);
      if (embedded['companies'] && Array.isArray(embedded['companies']) && embedded['companies'][0]) {
        this.setCompany(embedded['companies'][0] as Record<string, unknown>);
      }
      if (embedded[CustomerModel.CONTACTS]) this.setContacts(embedded[CustomerModel.CONTACTS] as Record<string, unknown>[]);
      if (embedded[CustomerModel.CATALOG_ELEMENTS]) this.setCatalogElementsLinks(embedded[CustomerModel.CATALOG_ELEMENTS] as Record<string, unknown>[]);
    }

    return this as this;
  }

  toArray(): Record<string, unknown> {
    const result: Record<string, unknown> = {
      id: this.id,
      name: this.name,
      next_price: this.nextPrice,
      next_date: this.nextDate,
      responsible_user_id: this.responsibleUserId,
      status_id: this.statusId,
      periodicity: this.periodicity,
      created_by: this.createdBy,
      updated_by: this.updatedBy,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      closest_task_at: this.closestTaskAt,
      is_deleted: this.isDeleted,
      custom_fields_values: this.customFieldsValues,
      ltv: this.ltv,
      purchases_count: this.purchasesCount,
      average_check: this.averageCheck,
      account_id: this.accountId,
    };

    if (this.catalogElementsLinks !== null) result['catalog_elements'] = this.catalogElementsLinks;
    if (this.tags !== null) result['tags'] = this.tags;
    if (this.company !== null) result['company'] = this.company;
    if (this.contacts !== null) result['contacts'] = this.contacts;
    if (this.segments !== null) result['segments'] = this.segments;
    if (this.groupId !== null) result['group_id'] = this.groupId;

    return result;
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    if (this.id !== null) result['id'] = this.id;
    if (this.name !== null) result['name'] = this.name;
    if (this.nextPrice !== null) result['next_price'] = this.nextPrice;
    if (this.nextDate !== null) result['next_date'] = this.nextDate;
    if (this.periodicity !== null) result['periodicity'] = this.periodicity;
    if (this.responsibleUserId !== null) result['responsible_user_id'] = this.responsibleUserId;
    if (this.statusId !== null) result['status_id'] = this.statusId;
    if (this.createdBy !== null) result['created_by'] = this.createdBy;
    if (this.updatedBy !== null) result['updated_by'] = this.updatedBy;
    if (this.createdAt !== null) result['created_at'] = this.createdAt;
    if (this.customFieldsValues !== null) result['custom_fields_values'] = this.customFieldsValues;

    if (this.tags !== null) {
      result[EMBEDDED] = { ...(result[EMBEDDED] as Record<string, unknown> || {}), tags: this.tags };
    }

    if (this.segments !== null) {
      result[EMBEDDED] = { ...(result[EMBEDDED] as Record<string, unknown> || {}), segments: this.segments };
    }

    if (this.requestId === null && requestId !== null && requestId !== undefined) {
      this.requestId = String(requestId);
    }

    result['request_id'] = this.requestId;

    return result;
  }
}
