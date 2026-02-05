import { BaseApiModel } from './BaseApiModel';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';

/**
 * Custom field model
 */
export class CustomFieldModel extends BaseApiModel {
  static readonly TYPE_TEXT = 'text';
  static readonly TYPE_NUMERIC = 'numeric';
  static readonly TYPE_CHECKBOX = 'checkbox';
  static readonly TYPE_SELECT = 'select';
  static readonly TYPE_MULTISELECT = 'multiselect';
  static readonly TYPE_MULTITEXT = 'multitext';
  static readonly TYPE_DATE = 'date';
  static readonly TYPE_URL = 'url';
  static readonly TYPE_TEXTAREA = 'textarea';
  static readonly TYPE_RADIOBUTTON = 'radiobutton';
  static readonly TYPE_STREET_ADDRESS = 'streetaddress';
  static readonly TYPE_SMART_ADDRESS = 'smart_address';
  static readonly TYPE_BIRTHDAY = 'birthday';
  static readonly TYPE_LEGAL_ENTITY = 'legal_entity';
  static readonly TYPE_DATE_TIME = 'date_time';
  static readonly TYPE_ITEMS = 'items';
  static readonly TYPE_CATEGORY = 'category';
  static readonly TYPE_PRICE = 'price';
  static readonly TYPE_TRACKING_DATA = 'tracking_data';
  static readonly TYPE_LINKED_ENTITY = 'linked_entity';
  static readonly TYPE_MONETARY = 'monetary';
  static readonly TYPE_CHAINED_LIST = 'chained_list';
  static readonly TYPE_FILE = 'file';
  static readonly TYPE_PAYER = 'payer';
  static readonly TYPE_SUPPLIER = 'supplier';

  protected id: number | null = null;
  protected name: string | null = null;
  protected groupId: string | null = null;
  protected sort: number | null = null;
  protected isApiOnly: boolean | null = null;
  protected isDeletable: boolean | null = null;
  protected isVisible: boolean | null = null;
  protected isRequired: boolean | null = null;
  protected catalogId: number | null = null;
  protected isPredefined: boolean | number | null = null;
  protected requiredStatuses: Record<string, unknown>[] | null = null;
  protected code: string | null = null;
  protected accountId: number | null = null;
  protected entityType: string | null = null;
  protected trackingCallback: string | null = null;
  protected searchIn: string | null = null;
  protected type: string | null = null;
  protected requestId: string | null = null;

  getId() { return this.id; }
  setId(id: number) { this.id = id; return this; }
  getName() { return this.name; }
  setName(name: string) { this.name = name; return this; }
  getGroupId() { return this.groupId; }
  setGroupId(groupId: string | null) { this.groupId = groupId; return this; }
  getSort() { return this.sort; }
  setSort(sort: number) { this.sort = sort; return this; }
  getIsApiOnly() { return this.isApiOnly; }
  setIsApiOnly(isApiOnly: boolean) {
    if (isApiOnly) this.setRequiredStatuses(null);
    this.isApiOnly = isApiOnly;
    return this;
  }
  getIsDeletable() { return this.isDeletable; }
  setIsDeletable(isDeletable: boolean | null) { this.isDeletable = isDeletable; return this; }
  getIsVisible() { return this.isVisible; }
  setIsVisible(isVisible: boolean | null) { this.isVisible = isVisible; return this; }
  getIsRequired() { return this.isRequired; }
  setIsRequired(isRequired: boolean | null) { this.isRequired = isRequired; return this; }
  getCatalogId() { return this.catalogId; }
  setCatalogId(catalogId: number | null) { this.catalogId = catalogId; return this; }
  getIsPredefined() { return this.isPredefined; }
  setIsPredefined(isPredefined: boolean | number | null) { this.isPredefined = isPredefined; return this; }
  getRequiredStatuses() { return this.requiredStatuses; }
  setRequiredStatuses(requiredStatuses: Record<string, unknown>[] | null) { this.requiredStatuses = requiredStatuses; return this; }
  getCode() { return this.code; }
  setCode(code: string | null) { this.code = code; return this; }
  getAccountId() { return this.accountId; }
  setAccountId(accountId: number) { this.accountId = accountId; return this; }
  getEntityType() { return this.entityType; }
  setEntityType(entityType: string) { this.entityType = entityType; return this; }
  getTrackingCallback() { return this.trackingCallback; }
  setTrackingCallback(trackingCallback: string | null) { this.trackingCallback = trackingCallback; return this; }
  getSearchIn() { return this.searchIn; }
  setSearchIn(searchIn: string | null) { this.searchIn = searchIn; return this; }
  getType() { return this.type || ''; }
  setType(type: string | null) { this.type = type; return this; }
  getRequestId() { return this.requestId; }
  setRequestId(id: string | null) { this.requestId = id; return this; }

  fromArray(data: Record<string, unknown>): this {
    if (!data['id']) {
      throw new InvalidArgumentException('Custom field id is empty in ' + JSON.stringify(data));
    }
    this.setId(Number(data['id']));
    if (data['name']) this.setName(String(data['name']));
    if (data['sort'] !== undefined) this.setSort(Number(data['sort']));
    if (data['code']) this.setCode(String(data['code']));
    if (data['entity_type']) this.setEntityType(String(data['entity_type']));
    if (data['account_id']) this.setAccountId(Number(data['account_id']));
    if (data['group_id']) this.setGroupId(String(data['group_id']));
    if (data['required_statuses']) this.setRequiredStatuses(data['required_statuses'] as Record<string, unknown>[]);
    if ('is_api_only' in data) this.setIsApiOnly(Boolean(data['is_api_only']));
    if ('is_deletable' in data) this.setIsDeletable(Boolean(data['is_deletable']));
    if ('is_required' in data) this.setIsRequired(Boolean(data['is_required']));
    if ('is_visible' in data) this.setIsVisible(Boolean(data['is_visible']));
    if ('catalog_id' in data) this.setCatalogId(data['catalog_id'] as number | null);
    if ('is_predefined' in data) this.setIsPredefined(data['is_predefined'] as boolean | number | null);
    if ('tracking_callback' in data) this.setTrackingCallback(data['tracking_callback'] as string | null);
    if ('search_in' in data) this.setSearchIn(data['search_in'] as string | null);
    if (data['type']) this.setType(String(data['type']));

    return this as this;
  }

  toArray(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      sort: this.sort,
      type: this.getType(),
      is_api_only: this.isApiOnly,
      code: this.code,
      group_id: this.groupId,
      entity_type: this.entityType,
      required_statuses: this.requiredStatuses,
      tracking_callback: this.trackingCallback,
      search_in: this.searchIn,
      account_id: this.accountId,
    };
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    const result: Record<string, unknown> = {
      type: this.getType(),
    };

    if (this.id !== null) result['id'] = this.id;
    if (this.name !== null) result['name'] = this.name;
    if (this.code !== null) result['code'] = this.code;
    if (this.sort !== null) result['sort'] = this.sort;
    if (this.groupId !== null) result['group_id'] = this.groupId;
    if (this.isApiOnly !== null) result['is_api_only'] = this.isApiOnly;
    if (this.requiredStatuses !== null) result['required_statuses'] = this.requiredStatuses;
    if (this.isDeletable !== null) result['is_deletable'] = this.isDeletable;
    if (this.isRequired !== null) result['is_required'] = this.isRequired;
    if (this.isVisible !== null) result['is_visible'] = this.isVisible;
    if (this.searchIn !== null) result['search_in'] = this.searchIn;

    if (this.requestId === null && requestId !== null && requestId !== undefined) {
      this.requestId = String(requestId);
    }

    result['request_id'] = this.requestId;

    return result;
  }
}
