import { BaseApiModel } from './BaseApiModel';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';

export const EMBEDDED = '_embedded';

export class LeadModel extends BaseApiModel {
  static readonly LOST_STATUS_ID = 143;
  static readonly WON_STATUS_ID = 142;
  static readonly CATALOG_ELEMENTS = 'catalog_elements';
  static readonly IS_PRICE_BY_ROBOT = 'is_price_modified_by_robot';
  static readonly LOSS_REASON = 'loss_reason';
  static readonly SOURCE_ID = 'source_id';
  static readonly CONTACTS = 'contacts';
  static readonly SOURCE = 'source';
  static readonly ONLY_DELETED = 'only_deleted';

  protected id: number | null = null;
  protected name: string | null = null;
  protected responsibleUserId: number | null = null;
  protected groupId: number | null = null;
  protected createdBy: number | null = null;
  protected updatedBy: number | null = null;
  protected createdAt: number | null = null;
  protected updatedAt: number | null = null;
  protected accountId: number | null = null;
  protected pipelineId: number | null = null;
  protected statusId: number | null = null;
  protected closedAt: number | null = null;
  protected closestTaskAt: number | null = null;
  protected price: number | null = null;
  protected lossReasonId: number | null = null;
  protected isDeleted: boolean | null = null;
  protected tags: Record<string, unknown>[] | null = null;
  protected sourceId: number | null = null;
  protected sourceExternalId: string | null = null;
  protected customFieldsValues: Record<string, unknown>[] | null = null;
  protected score: number | null = null;
  protected isPriceModifiedByRobot: boolean | null = null;
  protected contacts: Record<string, unknown>[] | null = null;
  protected company: Record<string, unknown> | null = null;
  protected catalogElementsLinks: Record<string, unknown>[] | null = null;
  protected visitorUid: string | null = null;
  protected metadata: Record<string, unknown> | null = null;
  protected requestId: string | null = null;
  protected lossReason: Record<string, unknown> | null = null;
  protected source: Record<string, unknown> | null = null;

  getType(): string { return EntityTypes.LEADS; }

  getId() { return this.id; }
  setId(id: number) { this.id = id; return this; }
  getName() { return this.name; }
  setName(name: string) { this.name = name; return this; }
  getPrice() { return this.price; }
  setPrice(price: number | null) { this.price = price; return this; }
  getAccountId() { return this.accountId; }
  setAccountId(id: number | null) { this.accountId = id; return this; }
  getGroupId() { return this.groupId; }
  setGroupId(id: number | null) { this.groupId = id; return this; }
  getResponsibleUserId() { return this.responsibleUserId; }
  setResponsibleUserId(id: number | null) { this.responsibleUserId = id; return this; }
  getCreatedBy() { return this.createdBy; }
  setCreatedBy(id: number | null) { this.createdBy = id; return this; }
  getUpdatedBy() { return this.updatedBy; }
  setUpdatedBy(id: number | null) { this.updatedBy = id; return this; }
  getCreatedAt() { return this.createdAt; }
  setCreatedAt(ts: number | null) { this.createdAt = ts; return this; }
  getUpdatedAt() { return this.updatedAt; }
  setUpdatedAt(ts: number | null) { this.updatedAt = ts; return this; }
  getPipelineId() { return this.pipelineId; }
  setPipelineId(id: number | null) { this.pipelineId = id; return this; }
  getStatusId() { return this.statusId; }
  setStatusId(id: number | null) { this.statusId = id; return this; }
  getClosedAt() { return this.closedAt; }
  setClosedAt(ts: number | null) { this.closedAt = ts; return this; }
  getClosestTaskAt() { return this.closestTaskAt; }
  setClosestTaskAt(ts: number | null) { this.closestTaskAt = ts; return this; }
  getLossReasonId() { return this.lossReasonId; }
  setLossReasonId(id: number | null) { this.lossReasonId = id; return this; }
  getLossReason() { return this.lossReason; }
  setLossReason(lr: Record<string, unknown> | null) { this.lossReason = lr; return this; }
  getIsDeleted() { return this.isDeleted; }
  setIsDeleted(flag: boolean | null) { this.isDeleted = flag; return this; }
  getTags() { return this.tags; }
  setTags(tags: Record<string, unknown>[] | null) { this.tags = tags; return this; }
  getSourceId() { return this.sourceId; }
  setSourceId(id: number | null) { this.sourceId = id; return this; }
  getSource() { return this.source; }
  setSource(s: Record<string, unknown> | null) { this.source = s; return this; }
  getSourceExternalId() { return this.sourceExternalId; }
  setSourceExternalId(id: string | null) { this.sourceExternalId = id; return this; }
  getCustomFieldsValues() { return this.customFieldsValues; }
  setCustomFieldsValues(v: Record<string, unknown>[] | null) { this.customFieldsValues = v; return this; }
  getScore() { return this.score; }
  setScore(s: number | null) { this.score = s; return this; }
  getIsPriceModifiedByRobot() { return this.isPriceModifiedByRobot; }
  getContacts() { return this.contacts; }
  setContacts(c: Record<string, unknown>[] | null) { this.contacts = c; return this; }
  getCompany() { return this.company; }
  setCompany(c: Record<string, unknown> | null) { this.company = c; return this; }
  getCatalogElementsLinks() { return this.catalogElementsLinks; }
  setCatalogElementsLinks(c: Record<string, unknown>[] | null) { this.catalogElementsLinks = c; return this; }
  getVisitorUid() { return this.visitorUid; }
  setVisitorUid(uid: string | null) { this.visitorUid = uid; return this; }
  getMetadata() { return this.metadata; }
  setMetadata(m: Record<string, unknown> | null) { this.metadata = m; return this; }
  getRequestId() { return this.requestId; }
  setRequestId(id: string | null) { this.requestId = id; return this; }

  static getAvailableWith(): string[] {
    return [
      LeadModel.CATALOG_ELEMENTS,
      LeadModel.IS_PRICE_BY_ROBOT,
      LeadModel.CONTACTS,
      LeadModel.SOURCE_ID,
      LeadModel.LOSS_REASON,
      LeadModel.ONLY_DELETED,
      LeadModel.SOURCE,
    ];
  }

  fromArray(data: Record<string, unknown>): this {
    if (!data['id']) {
      throw new InvalidArgumentException('Lead id is empty in ' + JSON.stringify(data));
    }
    this.setId(Number(data['id']));
    if (data['name']) this.setName(String(data['name']));
    if (data['price'] !== undefined && data['price'] !== null) this.setPrice(Number(data['price']));
    if (data['responsible_user_id'] !== undefined && data['responsible_user_id'] !== null) this.setResponsibleUserId(Number(data['responsible_user_id']));
    if (data['group_id'] !== undefined && data['group_id'] !== null) this.setGroupId(Number(data['group_id']));
    if (data['status_id']) this.setStatusId(Number(data['status_id']));
    if (data['pipeline_id']) this.setPipelineId(Number(data['pipeline_id']));
    if (data['loss_reason_id']) this.setLossReasonId(Number(data['loss_reason_id']) > 0 ? Number(data['loss_reason_id']) : null);
    if (data['source_id'] !== undefined) this.setSourceId(Number(data['source_id']) > 0 ? Number(data['source_id']) : null);
    if (data['created_by'] !== undefined && data['created_by'] !== null) this.setCreatedBy(Number(data['created_by']));
    if (data['updated_by'] !== undefined && data['updated_by'] !== null) this.setUpdatedBy(Number(data['updated_by']));
    if (data['created_at']) this.setCreatedAt(Number(data['created_at']));
    if (data['updated_at']) this.setUpdatedAt(Number(data['updated_at']));
    if (data['closed_at']) this.setClosedAt(Number(data['closed_at']) > 0 ? Number(data['closed_at']) : null);
    if (data['closest_task_at']) this.setClosestTaskAt(Number(data['closest_task_at']) > 0 ? Number(data['closest_task_at']) : null);
    if (data['is_deleted'] !== undefined && data['is_deleted'] !== null) this.setIsDeleted(Boolean(data['is_deleted']));
    if (data['custom_fields_values']) this.setCustomFieldsValues(data['custom_fields_values'] as Record<string, unknown>[]);
    if (data['score'] !== undefined) this.setScore(Number(data['score']) > 0 ? Number(data['score']) : null);
    if (data['account_id']) this.setAccountId(Number(data['account_id']));
    if (data['is_price_modified_by_robot'] !== undefined && data['is_price_modified_by_robot'] !== null) this.isPriceModifiedByRobot = Boolean(data['is_price_modified_by_robot']);

    const embedded = data[EMBEDDED] as Record<string, unknown> | undefined;
    if (embedded) {
      if (embedded['tags']) this.setTags(embedded['tags'] as Record<string, unknown>[]);
      if (embedded['loss_reason'] && Array.isArray(embedded['loss_reason']) && embedded['loss_reason'][0]) this.setLossReason(embedded['loss_reason'][0] as Record<string, unknown>);
      if (embedded['companies'] && Array.isArray(embedded['companies']) && embedded['companies'][0]) this.setCompany(embedded['companies'][0] as Record<string, unknown>);
      if (embedded['contacts']) this.setContacts(embedded['contacts'] as Record<string, unknown>[]);
      if (embedded['catalog_elements']) this.setCatalogElementsLinks(embedded['catalog_elements'] as Record<string, unknown>[]);
      if (embedded['source']) this.setSource(embedded['source'] as Record<string, unknown>);
    }

    return this as this;
  }

  toArray(): Record<string, unknown> {
    const result: Record<string, unknown> = {
      name: this.name, price: this.price, responsible_user_id: this.responsibleUserId,
      group_id: this.groupId, status_id: this.statusId, pipeline_id: this.pipelineId,
      loss_reason_id: this.lossReasonId, source_id: this.sourceId,
      created_by: this.createdBy, updated_by: this.updatedBy,
      created_at: this.createdAt, updated_at: this.updatedAt,
      closed_at: this.closedAt, closest_task_at: this.closestTaskAt,
      is_deleted: this.isDeleted, custom_fields_values: this.customFieldsValues,
      score: this.score, account_id: this.accountId,
    };
    if (this.id !== null) result['id'] = this.id;
    if (this.tags !== null) result['tags'] = this.tags;
    if (this.lossReason !== null) result['loss_reason'] = this.lossReason;
    if (this.company !== null) result['company'] = this.company;
    if (this.contacts !== null) result['contacts'] = this.contacts;
    if (this.catalogElementsLinks !== null) result['catalog_elements'] = this.catalogElementsLinks;
    if (this.isPriceModifiedByRobot !== null) result['is_price_modified_by_robot'] = this.isPriceModifiedByRobot;
    if (this.source !== null) result['source'] = this.source;
    return result;
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    if (this.id !== null) result['id'] = this.id;
    if (this.name !== null) result['name'] = this.name;
    if (this.price !== null) result['price'] = this.price;
    if (this.responsibleUserId !== null) result['responsible_user_id'] = this.responsibleUserId;
    if (this.statusId !== null) result['status_id'] = this.statusId;
    if (this.pipelineId !== null) result['pipeline_id'] = this.pipelineId;
    if (this.statusId === LeadModel.LOST_STATUS_ID && this.lossReasonId !== null) result['loss_reason_id'] = this.lossReasonId;
    if (this.createdBy !== null) result['created_by'] = this.createdBy;
    if (this.updatedBy !== null) result['updated_by'] = this.updatedBy;
    if (this.createdAt !== null) result['created_at'] = this.createdAt;
    if (this.closedAt !== null) result['closed_at'] = this.closedAt;
    if (this.customFieldsValues !== null) result['custom_fields_values'] = this.customFieldsValues;
    if (this.tags !== null) result[EMBEDDED] = { ...(result[EMBEDDED] as Record<string, unknown> || {}), tags: this.tags };
    if (this.visitorUid !== null) result['visitor_uid'] = this.visitorUid;
    if (this.id === null && this.contacts !== null) {
      result[EMBEDDED] = { ...(result[EMBEDDED] as Record<string, unknown> || {}), contacts: this.contacts };
    }
    if (this.id === null && this.company !== null) {
      result[EMBEDDED] = { ...(result[EMBEDDED] as Record<string, unknown> || {}), companies: [{ id: (this.company as Record<string, unknown>)['id'] }] };
    }
    if (this.id === null && this.sourceExternalId !== null) {
      result[EMBEDDED] = { ...(result[EMBEDDED] as Record<string, unknown> || {}), source: { type: 'widget', external_id: this.sourceExternalId } };
    }
    if (this.requestId === null && requestId !== null && requestId !== undefined) this.requestId = String(requestId);
    result['request_id'] = this.requestId;
    return result;
  }
}
