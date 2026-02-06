import { BaseApiModel } from './BaseApiModel';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';

const EMBEDDED = '_embedded';

export class AccountModel extends BaseApiModel {
  static readonly AMOJO_ID = 'amojo_id';
  static readonly AMOJO_RIGHTS = 'amojo_rights';
  static readonly USERS_GROUPS = 'users_groups';
  static readonly TASK_TYPES = 'task_types';
  static readonly VERSION = 'version';
  static readonly ENTITY_NAMES = 'entity_names';
  static readonly DATETIME_SETTINGS = 'datetime_settings';
  static readonly IS_API_FILTER_ENABLED = 'is_api_filter_enabled';
  static readonly DRIVE_URL = 'drive_url';
  static readonly IS_UNSORTED_ON = 'is_unsorted_on';
  static readonly IS_LOSS_REASON_ENABLED = 'is_loss_reason_enabled';
  static readonly IS_HELPBOT_ENABLED = 'is_helpbot_enabled';
  static readonly IS_TECHNICAL_ACCOUNT = 'is_technical_account';
  static readonly CONTACT_NAME_DISPLAY_ORDER = 'contact_name_display_order';
  static readonly INVOICES_SETTINGS = 'invoices_settings';

  protected id: number | null = null;
  protected name: string | null = null;
  protected subdomain: string | null = null;
  protected createdAt: number | null = null;
  protected createdBy: number | null = null;
  protected updatedAt: number | null = null;
  protected updatedBy: number | null = null;
  protected currentUserId: number | null = null;
  protected country: string | null = null;
  protected currency: string | null = null;
  protected currencySymbol: string | null = null;
  protected customersMode: string | null = null;
  protected isUnsortedOn: boolean | null = null;
  protected isLossReasonEnabled: boolean | null = null;
  protected isHelpbotEnabled: boolean | null = null;
  protected isTechnicalAccount: boolean | null = null;
  protected contactNameDisplayOrder: number | null = null;
  protected amojoId: string | null = null;
  protected version: number | null = null;
  protected amojoRights: Record<string, unknown> | null = null;
  protected usersGroups: Record<string, unknown>[] | null = null;
  protected taskTypes: Record<string, unknown>[] | null = null;
  protected entityNames: Record<string, unknown> | null = null;
  protected datetimeSettings: Record<string, unknown> | null = null;
  protected driveUrl: string | null = null;
  protected isApiFilterEnabled: boolean | null = null;
  protected invoicesSettings: Record<string, unknown> | null = null;

  getId() { return this.id; }
  setId(id: number) { this.id = id; return this; }
  getName() { return this.name; }
  setName(name: string | null) { this.name = name; return this; }
  getSubdomain() { return this.subdomain; }
  setSubdomain(s: string | null) { this.subdomain = s; return this; }
  getCreatedAt() { return this.createdAt; }
  setCreatedAt(ts: number | null) { this.createdAt = ts; return this; }
  getCreatedBy() { return this.createdBy; }
  setCreatedBy(id: number | null) { this.createdBy = id; return this; }
  getUpdatedAt() { return this.updatedAt; }
  setUpdatedAt(ts: number | null) { this.updatedAt = ts; return this; }
  getUpdatedBy() { return this.updatedBy; }
  setUpdatedBy(id: number | null) { this.updatedBy = id; return this; }
  getCurrentUserId() { return this.currentUserId; }
  setCurrentUserId(id: number | null) { this.currentUserId = id; return this; }
  getCountry() { return this.country; }
  setCountry(c: string | null) { this.country = c; return this; }
  getCurrency() { return this.currency; }
  setCurrency(c: string | null) { this.currency = c; return this; }
  getCurrencySymbol() { return this.currencySymbol; }
  setCurrencySymbol(s: string | null) { this.currencySymbol = s; return this; }
  getCustomersMode() { return this.customersMode; }
  setCustomersMode(m: string | null) { this.customersMode = m; return this; }
  getIsUnsortedOn() { return this.isUnsortedOn; }
  setIsUnsortedOn(f: boolean | null) { this.isUnsortedOn = f; return this; }
  getIsLossReasonEnabled() { return this.isLossReasonEnabled; }
  setIsLossReasonEnabled(f: boolean | null) { this.isLossReasonEnabled = f; return this; }
  getIsHelpbotEnabled() { return this.isHelpbotEnabled; }
  setIsHelpbotEnabled(f: boolean | null) { this.isHelpbotEnabled = f; return this; }
  getIsTechnicalAccount() { return this.isTechnicalAccount; }
  setIsTechnicalAccount(f: boolean | null) { this.isTechnicalAccount = f; return this; }
  getContactNameDisplayOrder() { return this.contactNameDisplayOrder; }
  setContactNameDisplayOrder(o: number | null) { this.contactNameDisplayOrder = o; return this; }
  getAmojoId() { return this.amojoId; }
  setAmojoId(id: string | null) { this.amojoId = id; return this; }
  getVersion() { return this.version; }
  setVersion(v: number | null) { this.version = v; return this; }
  getAmojoRights() { return this.amojoRights; }
  setAmojoRights(r: Record<string, unknown> | null) { this.amojoRights = r; return this; }
  getUsersGroups() { return this.usersGroups; }
  setUsersGroups(g: Record<string, unknown>[] | null) { this.usersGroups = g; return this; }
  getTaskTypes() { return this.taskTypes; }
  setTaskTypes(t: Record<string, unknown>[] | null) { this.taskTypes = t; return this; }
  getEntityNames() { return this.entityNames; }
  setEntityNames(e: Record<string, unknown> | null) { this.entityNames = e; return this; }
  getDatetimeSettings() { return this.datetimeSettings; }
  setDatetimeSettings(d: Record<string, unknown> | null) { this.datetimeSettings = d; return this; }
  getDriveUrl() { return this.driveUrl; }
  setDriveUrl(u: string | null) { this.driveUrl = u; return this; }
  getIsApiFilterEnabled() { return this.isApiFilterEnabled; }
  setIsApiFilterEnabled(f: boolean | null) { this.isApiFilterEnabled = f; return this; }
  getInvoicesSettings() { return this.invoicesSettings; }
  setInvoicesSettings(s: Record<string, unknown> | null) { this.invoicesSettings = s; return this; }

  static getAvailableWith(): string[] {
    return [
      AccountModel.AMOJO_ID, AccountModel.AMOJO_RIGHTS,
      AccountModel.USERS_GROUPS, AccountModel.TASK_TYPES,
      AccountModel.VERSION, AccountModel.ENTITY_NAMES,
      AccountModel.DATETIME_SETTINGS, AccountModel.IS_API_FILTER_ENABLED,
      AccountModel.DRIVE_URL, AccountModel.IS_UNSORTED_ON,
      AccountModel.IS_LOSS_REASON_ENABLED, AccountModel.IS_HELPBOT_ENABLED,
      AccountModel.IS_TECHNICAL_ACCOUNT, AccountModel.CONTACT_NAME_DISPLAY_ORDER,
      AccountModel.INVOICES_SETTINGS,
    ];
  }

  fromArray(data: Record<string, unknown>): this {
    if (!data['id']) {
      throw new InvalidArgumentException('Account id is empty in ' + JSON.stringify(data));
    }
    this.setId(Number(data['id']));
    if (data['name']) this.setName(String(data['name']));
    if (data['subdomain']) this.setSubdomain(String(data['subdomain']));
    if (data['created_at']) this.setCreatedAt(Number(data['created_at']));
    if (data['created_by']) this.setCreatedBy(Number(data['created_by']));
    if (data['updated_at']) this.setUpdatedAt(Number(data['updated_at']));
    if (data['updated_by']) this.setUpdatedBy(Number(data['updated_by']));
    if (data['current_user_id']) this.setCurrentUserId(Number(data['current_user_id']));
    if (data['country'] !== undefined && data['country'] !== null) this.setCountry(String(data['country']));
    if (data['currency'] !== undefined && data['currency'] !== null) this.setCurrency(String(data['currency']));
    if (data['currency_symbol'] !== undefined && data['currency_symbol'] !== null) this.setCurrencySymbol(String(data['currency_symbol']));
    if (data['customers_mode'] !== undefined && data['customers_mode'] !== null) this.setCustomersMode(String(data['customers_mode']));
    if (data['is_unsorted_on'] !== undefined && data['is_unsorted_on'] !== null) this.setIsUnsortedOn(Boolean(data['is_unsorted_on']));
    if (data['is_loss_reason_enabled'] !== undefined && data['is_loss_reason_enabled'] !== null) this.setIsLossReasonEnabled(Boolean(data['is_loss_reason_enabled']));
    if (data['is_helpbot_enabled'] !== undefined && data['is_helpbot_enabled'] !== null) this.setIsHelpbotEnabled(Boolean(data['is_helpbot_enabled']));
    if (data['is_technical_account'] !== undefined && data['is_technical_account'] !== null) this.setIsTechnicalAccount(Boolean(data['is_technical_account']));
    if (data['contact_name_display_order'] !== undefined && data['contact_name_display_order'] !== null) this.setContactNameDisplayOrder(Number(data['contact_name_display_order']));
    if (data['amojo_id'] !== undefined && data['amojo_id'] !== null) this.setAmojoId(String(data['amojo_id']));
    if (data['version'] !== undefined && data['version'] !== null) this.setVersion(Number(data['version']));
    if (data['drive_url'] !== undefined && data['drive_url'] !== null) this.setDriveUrl(String(data['drive_url']));
    if (data['is_api_filter_enabled'] !== undefined && data['is_api_filter_enabled'] !== null) this.setIsApiFilterEnabled(Boolean(data['is_api_filter_enabled']));

    const embedded = data[EMBEDDED] as Record<string, unknown> | undefined;
    if (embedded) {
      if (embedded['amojo_rights']) this.setAmojoRights(embedded['amojo_rights'] as Record<string, unknown>);
      if (embedded['users_groups']) this.setUsersGroups(embedded['users_groups'] as Record<string, unknown>[]);
      if (embedded['task_types']) this.setTaskTypes(embedded['task_types'] as Record<string, unknown>[]);
      if (embedded['entity_names']) this.setEntityNames(embedded['entity_names'] as Record<string, unknown>);
      if (embedded['datetime_settings']) this.setDatetimeSettings(embedded['datetime_settings'] as Record<string, unknown>);
      if (embedded['invoices_settings']) this.setInvoicesSettings(embedded['invoices_settings'] as Record<string, unknown>);
    }

    return this as this;
  }

  toArray(): Record<string, unknown> {
    const result: Record<string, unknown> = {
      id: this.id, name: this.name, subdomain: this.subdomain,
      created_at: this.createdAt, created_by: this.createdBy,
      updated_at: this.updatedAt, updated_by: this.updatedBy,
      current_user_id: this.currentUserId, country: this.country,
      currency: this.currency, currency_symbol: this.currencySymbol,
      customers_mode: this.customersMode,
      is_unsorted_on: this.isUnsortedOn,
      is_loss_reason_enabled: this.isLossReasonEnabled,
      is_helpbot_enabled: this.isHelpbotEnabled,
      is_technical_account: this.isTechnicalAccount,
      contact_name_display_order: this.contactNameDisplayOrder,
      amojo_id: this.amojoId, version: this.version,
      amojo_rights: this.amojoRights, users_groups: this.usersGroups,
      task_types: this.taskTypes, entity_names: this.entityNames,
      datetime_settings: this.datetimeSettings, drive_url: this.driveUrl,
      is_api_filter_enabled: this.isApiFilterEnabled,
      invoices_settings: this.invoicesSettings,
    };
    return result;
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    return this.toArray();
  }
}
