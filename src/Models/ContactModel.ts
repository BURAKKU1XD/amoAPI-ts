import { BaseApiModel } from './BaseApiModel';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';

const EMBEDDED = '_embedded';

export class ContactModel extends BaseApiModel {
  static readonly LEADS = 'leads';
  static readonly CUSTOMERS = 'customers';
  static readonly CATALOG_ELEMENTS = 'catalog_elements';
  static readonly SOCIAL_PROFILES = 'social_profiles';
  static readonly ONLY_DELETED = 'only_deleted';

  protected id: number | null = null;
  protected name: string | null = null;
  protected firstName: string | null = null;
  protected lastName: string | null = null;
  protected responsibleUserId: number | null = null;
  protected groupId: number | null = null;
  protected createdBy: number | null = null;
  protected updatedBy: number | null = null;
  protected createdAt: number | null = null;
  protected updatedAt: number | null = null;
  protected closestTaskAt: number | null = null;
  protected accountId: number | null = null;
  protected tags: Record<string, unknown>[] | null = null;
  protected customFieldsValues: Record<string, unknown>[] | null = null;
  protected isMain: boolean | null = null;
  protected company: Record<string, unknown> | null = null;
  protected leads: Record<string, unknown>[] | null = null;
  protected customers: Record<string, unknown>[] | null = null;
  protected catalogElementsLinks: Record<string, unknown>[] | null = null;
  protected socialProfiles: Record<string, unknown>[] | null = null;
  protected isUnsortedFlag: boolean = false;
  protected requestId: string | null = null;

  getType(): string { return EntityTypes.CONTACTS; }

  getId() { return this.id; }
  setId(id: number) { this.id = id; return this; }
  getName() { return this.name; }
  setName(name: string | null) { this.name = name; return this; }
  getFirstName() { return this.firstName; }
  setFirstName(name: string | null) { this.firstName = name; return this; }
  getLastName() { return this.lastName; }
  setLastName(name: string | null) { this.lastName = name; return this; }
  getResponsibleUserId() { return this.responsibleUserId; }
  setResponsibleUserId(id: number | null) { this.responsibleUserId = id; return this; }
  getGroupId() { return this.groupId; }
  setGroupId(id: number | null) { this.groupId = id; return this; }
  getCreatedBy() { return this.createdBy; }
  setCreatedBy(id: number | null) { this.createdBy = id; return this; }
  getUpdatedBy() { return this.updatedBy; }
  setUpdatedBy(id: number | null) { this.updatedBy = id; return this; }
  getCreatedAt() { return this.createdAt; }
  setCreatedAt(ts: number | null) { this.createdAt = ts; return this; }
  getUpdatedAt() { return this.updatedAt; }
  setUpdatedAt(ts: number | null) { this.updatedAt = ts; return this; }
  getClosestTaskAt() { return this.closestTaskAt; }
  setClosestTaskAt(ts: number | null) { this.closestTaskAt = ts; return this; }
  getAccountId() { return this.accountId; }
  setAccountId(id: number | null) { this.accountId = id; return this; }
  getTags() { return this.tags; }
  setTags(tags: Record<string, unknown>[] | null) { this.tags = tags; return this; }
  getCustomFieldsValues() { return this.customFieldsValues; }
  setCustomFieldsValues(v: Record<string, unknown>[] | null) { this.customFieldsValues = v; return this; }
  getIsMain() { return this.isMain; }
  setIsMain(flag: boolean | null) { this.isMain = flag; return this; }
  getCompany() { return this.company; }
  setCompany(c: Record<string, unknown> | null) { this.company = c; return this; }
  getLeads() { return this.leads; }
  setLeads(l: Record<string, unknown>[] | null) { this.leads = l; return this; }
  getCustomers() { return this.customers; }
  setCustomers(c: Record<string, unknown>[] | null) { this.customers = c; return this; }
  getCatalogElementsLinks() { return this.catalogElementsLinks; }
  setCatalogElementsLinks(c: Record<string, unknown>[] | null) { this.catalogElementsLinks = c; return this; }
  getSocialProfiles() { return this.socialProfiles; }
  setSocialProfiles(s: Record<string, unknown>[] | null) { this.socialProfiles = s; return this; }
  isUnsorted() { return this.isUnsortedFlag; }
  setIsUnsorted(flag: boolean) { this.isUnsortedFlag = flag; return this; }
  getRequestId() { return this.requestId; }
  setRequestId(id: string | null) { this.requestId = id; return this; }

  static getAvailableWith(): string[] {
    return [
      ContactModel.LEADS,
      ContactModel.CUSTOMERS,
      ContactModel.CATALOG_ELEMENTS,
      ContactModel.SOCIAL_PROFILES,
      ContactModel.ONLY_DELETED,
    ];
  }

  fromArray(data: Record<string, unknown>): this {
    if (!data['id']) {
      throw new InvalidArgumentException('Contact id is empty in ' + JSON.stringify(data));
    }
    this.setId(Number(data['id']));
    if (data['name']) this.setName(String(data['name']));
    if (data['first_name'] !== undefined && data['first_name'] !== null) this.setFirstName(String(data['first_name']));
    if (data['last_name'] !== undefined && data['last_name'] !== null) this.setLastName(String(data['last_name']));
    if (data['responsible_user_id'] !== undefined && data['responsible_user_id'] !== null) this.setResponsibleUserId(Number(data['responsible_user_id']));
    if (data['group_id'] !== undefined && data['group_id'] !== null) this.setGroupId(Number(data['group_id']));
    if (data['is_main'] !== undefined && typeof data['is_main'] === 'boolean') this.setIsMain(Boolean(data['is_main']));
    if (data['custom_fields_values']) this.setCustomFieldsValues(data['custom_fields_values'] as Record<string, unknown>[]);
    if (data['created_by'] !== undefined && data['created_by'] !== null) this.setCreatedBy(Number(data['created_by']));
    if (data['updated_by'] !== undefined && data['updated_by'] !== null) this.setUpdatedBy(Number(data['updated_by']));
    if (data['created_at']) this.setCreatedAt(Number(data['created_at']));
    if (data['updated_at']) this.setUpdatedAt(Number(data['updated_at']));
    if (data['closest_task_at']) this.setClosestTaskAt(Number(data['closest_task_at']) > 0 ? Number(data['closest_task_at']) : null);
    if (data['is_unsorted']) this.setIsUnsorted(Boolean(data['is_unsorted']));
    if (data['account_id']) this.setAccountId(Number(data['account_id']));

    const embedded = data[EMBEDDED] as Record<string, unknown> | undefined;
    if (embedded) {
      if (embedded['tags']) this.setTags(embedded['tags'] as Record<string, unknown>[]);
      if (embedded['companies'] && Array.isArray(embedded['companies']) && embedded['companies'][0]) this.setCompany(embedded['companies'][0] as Record<string, unknown>);
      if (embedded[ContactModel.LEADS]) this.setLeads(embedded[ContactModel.LEADS] as Record<string, unknown>[]);
      if (embedded[ContactModel.CUSTOMERS]) this.setCustomers(embedded[ContactModel.CUSTOMERS] as Record<string, unknown>[]);
      if (embedded[ContactModel.CATALOG_ELEMENTS]) this.setCatalogElementsLinks(embedded[ContactModel.CATALOG_ELEMENTS] as Record<string, unknown>[]);
      if (embedded[ContactModel.SOCIAL_PROFILES]) this.setSocialProfiles(embedded[ContactModel.SOCIAL_PROFILES] as Record<string, unknown>[]);
    }

    return this as this;
  }

  toArray(): Record<string, unknown> {
    const result: Record<string, unknown> = {
      name: this.name, first_name: this.firstName, last_name: this.lastName,
      responsible_user_id: this.responsibleUserId, group_id: this.groupId,
      created_by: this.createdBy, updated_by: this.updatedBy,
      created_at: this.createdAt, updated_at: this.updatedAt,
      closest_task_at: this.closestTaskAt,
      custom_fields_values: this.customFieldsValues,
      account_id: this.accountId, is_unsorted: this.isUnsortedFlag,
    };
    if (this.id !== null) result['id'] = this.id;
    if (this.tags !== null) result['tags'] = this.tags;
    if (this.catalogElementsLinks !== null) result['catalog_elements'] = this.catalogElementsLinks;
    if (this.socialProfiles !== null) result['social_profiles'] = this.socialProfiles;
    if (this.company !== null) result['company'] = this.company;
    if (this.leads !== null) result['leads'] = this.leads;
    if (this.customers !== null) result['customers'] = this.customers;
    return result;
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    if (this.id !== null) result['id'] = this.id;
    if (this.name !== null) result['name'] = this.name;
    if (this.firstName !== null) result['first_name'] = this.firstName;
    if (this.lastName !== null) result['last_name'] = this.lastName;
    if (this.responsibleUserId !== null) result['responsible_user_id'] = this.responsibleUserId;
    if (this.createdBy !== null) result['created_by'] = this.createdBy;
    if (this.updatedBy !== null) result['updated_by'] = this.updatedBy;
    if (this.createdAt !== null) result['created_at'] = this.createdAt;
    if (this.customFieldsValues !== null) result['custom_fields_values'] = this.customFieldsValues;
    if (this.tags !== null) result[EMBEDDED] = { ...(result[EMBEDDED] as Record<string, unknown> || {}), tags: this.tags };
    if (this.requestId === null && requestId !== null && requestId !== undefined) this.requestId = String(requestId);
    if (this.requestId !== null) result['request_id'] = this.requestId;
    return result;
  }
}
