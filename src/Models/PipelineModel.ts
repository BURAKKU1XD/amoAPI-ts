import { BaseApiModel } from './BaseApiModel';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';

const EMBEDDED = '_embedded';

/**
 * Pipeline model
 */
export class PipelineModel extends BaseApiModel {
  protected id: number | null = null;
  protected name: string | null = null;
  protected sort: number | null = null;
  protected accountId: number | null = null;
  protected isMain: boolean | null = null;
  protected isUnsortedOn: boolean | null = null;
  protected isArchive: boolean | null = null;
  protected statuses: Record<string, unknown>[] | null = null;
  protected requestId: string | null = null;

  getId() { return this.id; }
  setId(id: number) { this.id = id; return this; }
  getName() { return this.name; }
  setName(name: string) { this.name = name; return this; }
  getSort() { return this.sort; }
  setSort(sort: number | null) { this.sort = sort; return this; }
  getAccountId() { return this.accountId; }
  setAccountId(accountId: number | null) { this.accountId = accountId; return this; }
  getIsMain() { return this.isMain; }
  setIsMain(isMain: boolean | null) { this.isMain = isMain; return this; }
  getIsUnsortedOn() { return this.isUnsortedOn; }
  setIsUnsortedOn(isUnsortedOn: boolean | null) { this.isUnsortedOn = isUnsortedOn; return this; }
  getIsArchive() { return this.isArchive; }
  setIsArchive(isArchive: boolean | null) { this.isArchive = isArchive; return this; }
  getStatuses() { return this.statuses; }
  setStatuses(statuses: Record<string, unknown>[] | null) { this.statuses = statuses; return this; }
  getRequestId() { return this.requestId; }
  setRequestId(id: string | null) { this.requestId = id; return this; }

  fromArray(data: Record<string, unknown>): this {
    this.setId(Number(data['id']));
    this.setName(String(data['name'] ?? ''));
    this.setSort(data['sort'] !== undefined ? Number(data['sort']) : null);
    this.setAccountId(data['account_id'] !== undefined ? Number(data['account_id']) : null);
    this.setIsMain(data['is_main'] !== undefined ? Boolean(data['is_main']) : null);
    this.setIsUnsortedOn(data['is_unsorted_on'] !== undefined ? Boolean(data['is_unsorted_on']) : null);
    this.setIsArchive(data['is_archive'] !== undefined ? Boolean(data['is_archive']) : null);

    const embedded = data[EMBEDDED] as Record<string, unknown> | undefined;
    if (embedded && embedded[EntityTypes.LEADS_STATUSES]) {
      this.setStatuses(embedded[EntityTypes.LEADS_STATUSES] as Record<string, unknown>[]);
    }

    return this as this;
  }

  toArray(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      sort: this.sort,
      account_id: this.accountId,
      is_main: this.isMain,
      is_unsorted_on: this.isUnsortedOn,
      is_archive: this.isArchive,
      statuses: this.statuses,
    };
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    if (this.name !== null) result['name'] = this.name;

    if (this.sort !== null) {
      result['sort'] = this.sort;
    } else if (!this.id) {
      result['sort'] = 100;
    }

    if (this.isMain !== null) result['is_main'] = this.isMain;

    if (this.isUnsortedOn !== null) {
      result['is_unsorted_on'] = this.isUnsortedOn;
    } else if (!this.id) {
      result['is_unsorted_on'] = true;
    }

    // Statuses can only be sent when creating a pipeline
    if (!this.id && this.statuses && this.statuses.length > 0) {
      result[EMBEDDED] = { [EntityTypes.LEADS_STATUSES]: this.statuses };
    }

    if (this.requestId === null && requestId !== null && requestId !== undefined) {
      this.requestId = String(requestId);
    }

    result['request_id'] = this.requestId;

    return result;
  }
}
