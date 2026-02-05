import { BaseApiModel } from './BaseApiModel';

/**
 * Unsorted model
 *
 * Represents an unsorted (incoming) lead entity from various sources
 * (forms, SIP calls, chats, etc.)
 */
export class UnsortedModel extends BaseApiModel {
  static readonly CATEGORY_SIP = 'sip';
  static readonly CATEGORY_MAIL = 'mail';
  static readonly CATEGORY_FORMS = 'forms';
  static readonly CATEGORY_CHATS = 'chats';

  protected uid: string | null = null;
  protected sourceUid: string | null = null;
  protected sourceName: string | null = null;
  protected category: string | null = null;
  protected pipelineId: number | null = null;
  protected createdAt: number | null = null;
  protected metadata: Record<string, unknown> | null = null;
  protected accountId: number | null = null;
  protected lead: Record<string, unknown> | null = null;
  protected contacts: Record<string, unknown>[] | null = null;
  protected companies: Record<string, unknown>[] | null = null;
  protected requestId: string | null = null;

  getUid() { return this.uid; }
  setUid(uid: string | null) { this.uid = uid; return this; }
  getSourceUid() { return this.sourceUid; }
  setSourceUid(sourceUid: string | null) { this.sourceUid = sourceUid; return this; }
  getSourceName() { return this.sourceName; }
  setSourceName(sourceName: string | null) { this.sourceName = sourceName; return this; }
  getCategory() { return this.category; }
  setCategory(category: string | null) { this.category = category; return this; }
  getPipelineId() { return this.pipelineId; }
  setPipelineId(pipelineId: number | null) { this.pipelineId = pipelineId; return this; }
  getCreatedAt() { return this.createdAt; }
  setCreatedAt(createdAt: number | null) { this.createdAt = createdAt; return this; }
  getMetadata() { return this.metadata; }
  setMetadata(metadata: Record<string, unknown> | null) { this.metadata = metadata; return this; }
  getAccountId() { return this.accountId; }
  setAccountId(accountId: number | null) { this.accountId = accountId; return this; }
  getLead() { return this.lead; }
  setLead(lead: Record<string, unknown> | null) { this.lead = lead; return this; }
  getContacts() { return this.contacts; }
  setContacts(contacts: Record<string, unknown>[] | null) { this.contacts = contacts; return this; }
  getCompanies() { return this.companies; }
  setCompanies(companies: Record<string, unknown>[] | null) { this.companies = companies; return this; }
  getRequestId() { return this.requestId; }
  setRequestId(id: string | null) { this.requestId = id; return this; }

  fromArray(data: Record<string, unknown>): this {
    if (data['uid']) this.setUid(String(data['uid']));
    if (data['source_uid']) this.setSourceUid(String(data['source_uid']));
    if (data['source_name']) this.setSourceName(String(data['source_name']));
    if (data['category']) this.setCategory(String(data['category']));
    if (data['pipeline_id'] !== undefined) this.setPipelineId(data['pipeline_id'] as number | null);
    if (data['created_at'] !== undefined) this.setCreatedAt(Number(data['created_at']));
    if (data['metadata']) this.setMetadata(data['metadata'] as Record<string, unknown>);
    if (data['account_id']) this.setAccountId(Number(data['account_id']));

    const embedded = data['_embedded'] as Record<string, unknown> | undefined;
    if (embedded) {
      if (embedded['leads'] && Array.isArray(embedded['leads']) && embedded['leads'][0]) {
        this.setLead(embedded['leads'][0] as Record<string, unknown>);
      }
      if (embedded['contacts']) this.setContacts(embedded['contacts'] as Record<string, unknown>[]);
      if (embedded['companies']) this.setCompanies(embedded['companies'] as Record<string, unknown>[]);
    }

    return this as this;
  }

  toArray(): Record<string, unknown> {
    return {
      uid: this.uid,
      source_uid: this.sourceUid,
      source_name: this.sourceName,
      category: this.category,
      pipeline_id: this.pipelineId,
      created_at: this.createdAt,
      metadata: this.metadata,
      account_id: this.accountId,
      lead: this.lead,
      contacts: this.contacts,
      companies: this.companies,
    };
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    if (this.sourceUid !== null) result['source_uid'] = this.sourceUid;
    if (this.sourceName !== null) result['source_name'] = this.sourceName;
    if (this.pipelineId !== null) result['pipeline_id'] = this.pipelineId;
    if (this.createdAt !== null) result['created_at'] = this.createdAt;
    if (this.metadata !== null) result['metadata'] = this.metadata;

    const embedded: Record<string, unknown> = {};
    if (this.lead !== null) embedded['leads'] = [this.lead];
    if (this.contacts !== null) embedded['contacts'] = this.contacts;
    if (this.companies !== null) embedded['companies'] = this.companies;
    if (Object.keys(embedded).length > 0) result['_embedded'] = embedded;

    if (this.requestId === null && requestId !== null && requestId !== undefined) {
      this.requestId = String(requestId);
    }

    result['request_id'] = this.requestId;

    return result;
  }
}
