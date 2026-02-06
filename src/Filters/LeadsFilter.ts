import { BaseEntityFilter, BaseRangeFilter, FilterParams, RangeFilter } from './BaseEntityFilter';
import { SortMode } from '../Enums/SortMode';

/**
 * Status filter interface for leads
 */
export interface LeadStatusFilter {
  status_id: number | null;
  pipeline_id: number | null;
}

/**
 * Custom fields values filter type
 */
export type CustomFieldsValuesFilter = Record<string | number, unknown>;

/**
 * Filter for leads entity
 */
export class LeadsFilter extends BaseEntityFilter {
  private ids: number[] | null = null;
  private names: string[] | null = null;
  private price: number | RangeFilter | null = null;
  private createdBy: number[] | null = null;
  private updatedBy: number[] | null = null;
  private responsibleUserId: number[] | null = null;
  private createdAt: number | RangeFilter | null = null;
  private updatedAt: number | RangeFilter | null = null;
  private closedAt: number | RangeFilter | null = null;
  private closestTaskAt: number | RangeFilter | null = null;
  private statuses: LeadStatusFilter[] | null = null;
  private pipelineIds: number[] | null = null;
  private customFieldsValues: CustomFieldsValuesFilter | null = null;
  private query: string | null = null;
  private orderField: string | null = null;
  private orderDirection: string | null = null;

  getIds(): number[] | null {
    return this.ids;
  }

  setIds(ids: number | number[]): this {
    this.ids = this.parseArrayOrNumberFilter(ids);
    return this;
  }

  getNames(): string[] | null {
    return this.names;
  }

  setNames(names: string | string[]): this {
    this.names = this.parseArrayOrStringFilter(names);
    return this;
  }

  getPrice(): number | RangeFilter | null {
    return this.price;
  }

  setPrice(price: BaseRangeFilter | number | null): this {
    if (price instanceof BaseRangeFilter) {
      this.price = price.toFilter();
    } else {
      this.price = this.parseIntOrIntRangeFilter(price);
    }
    return this;
  }

  getCreatedBy(): number[] | null {
    return this.createdBy;
  }

  setCreatedBy(createdBy: number | number[]): this {
    this.createdBy = this.parseArrayOrNumberFilter(createdBy);
    return this;
  }

  getUpdatedBy(): number[] | null {
    return this.updatedBy;
  }

  setUpdatedBy(updatedBy: number | number[]): this {
    this.updatedBy = this.parseArrayOrNumberFilter(updatedBy);
    return this;
  }

  getResponsibleUserId(): number[] | null {
    return this.responsibleUserId;
  }

  setResponsibleUserId(responsibleUserId: number | number[]): this {
    this.responsibleUserId = this.parseArrayOrNumberFilter(responsibleUserId);
    return this;
  }

  getCreatedAt(): number | RangeFilter | null {
    return this.createdAt;
  }

  setCreatedAt(createdAt: BaseRangeFilter | number | null): this {
    if (createdAt instanceof BaseRangeFilter) {
      this.createdAt = createdAt.toFilter();
    } else {
      this.createdAt = this.parseIntOrIntRangeFilter(createdAt);
    }
    return this;
  }

  getUpdatedAt(): number | RangeFilter | null {
    return this.updatedAt;
  }

  setUpdatedAt(updatedAt: BaseRangeFilter | number | null): this {
    if (updatedAt instanceof BaseRangeFilter) {
      this.updatedAt = updatedAt.toFilter();
    } else {
      this.updatedAt = this.parseIntOrIntRangeFilter(updatedAt);
    }
    return this;
  }

  getClosedAt(): number | RangeFilter | null {
    return this.closedAt;
  }

  setClosedAt(closedAt: BaseRangeFilter | number | null): this {
    if (closedAt instanceof BaseRangeFilter) {
      this.closedAt = closedAt.toFilter();
    } else {
      this.closedAt = this.parseIntOrIntRangeFilter(closedAt);
    }
    return this;
  }

  getClosestTaskAt(): number | RangeFilter | null {
    return this.closestTaskAt;
  }

  setClosestTaskAt(closestTaskAt: BaseRangeFilter | number | null): this {
    if (closestTaskAt instanceof BaseRangeFilter) {
      this.closestTaskAt = closestTaskAt.toFilter();
    } else {
      this.closestTaskAt = this.parseIntOrIntRangeFilter(closestTaskAt);
    }
    return this;
  }

  getStatuses(): LeadStatusFilter[] | null {
    return this.statuses;
  }

  setStatuses(statuses: Array<{ status_id?: number; pipeline_id?: number }>): this {
    const statusesFilter: LeadStatusFilter[] = [];

    for (const status of statuses) {
      if (status.status_id === undefined && status.pipeline_id === undefined) {
        continue;
      }

      statusesFilter.push({
        status_id: status.status_id ? Number(status.status_id) : null,
        pipeline_id: status.pipeline_id ? Number(status.pipeline_id) : null,
      });
    }

    this.statuses = statusesFilter.length === 0 ? null : statusesFilter;
    return this;
  }

  getPipelineIds(): number[] | null {
    return this.pipelineIds;
  }

  setPipelineIds(pipelineIds: number | number[]): this {
    let ids = Array.isArray(pipelineIds) ? pipelineIds : [pipelineIds];

    ids = [...new Set(
      ids
        .map((val) => (typeof val === 'number' && val > 0 ? val : null))
        .filter((val): val is number => val !== null)
    )];

    this.pipelineIds = ids.length === 0 ? null : ids;
    return this;
  }

  getCustomFieldsValues(): CustomFieldsValuesFilter | null {
    return this.customFieldsValues;
  }

  setCustomFieldsValues(customFieldsValues: Record<string | number, BaseRangeFilter | unknown[] | unknown>): this {
    const cfFilter: CustomFieldsValuesFilter = {};

    for (const [fieldId, value] of Object.entries(customFieldsValues)) {
      if (value instanceof BaseRangeFilter) {
        cfFilter[fieldId] = value.toFilter();
      } else if (Array.isArray(value)) {
        cfFilter[fieldId] = value;
      } else {
        cfFilter[fieldId] = [value];
      }
    }

    this.customFieldsValues = cfFilter;
    return this;
  }

  getQuery(): string | null {
    return this.query;
  }

  setQuery(query: string | number): this {
    if (typeof query !== 'string' && typeof query !== 'number') {
      throw new TypeError('Invalid query type');
    }

    const queryStr = String(query);
    if (queryStr.length > 0) {
      this.query = queryStr;
    }

    return this;
  }

  getOrder(): Record<string, string> | null {
    if (!this.orderField || !this.orderDirection) {
      return null;
    }
    return { [this.orderField]: this.orderDirection };
  }

  setOrder(field: string, direction: string = SortMode.ASC): this {
    this.orderField = field;
    this.orderDirection = direction;
    return this;
  }

  buildFilter(): FilterParams {
    const filter: FilterParams = {};
    const innerFilter: Record<string, unknown> = {};

    if (this.getIds() !== null) {
      innerFilter['id'] = this.getIds();
    }

    if (this.getNames() !== null) {
      innerFilter['name'] = this.getNames();
    }

    if (this.getPrice() !== null) {
      innerFilter['price'] = this.getPrice();
    }

    if (this.getCreatedBy() !== null) {
      innerFilter['created_by'] = this.getCreatedBy();
    }

    if (this.getUpdatedBy() !== null) {
      innerFilter['updated_by'] = this.getUpdatedBy();
    }

    if (this.getResponsibleUserId() !== null) {
      innerFilter['responsible_user_id'] = this.getResponsibleUserId();
    }

    if (this.getCreatedAt() !== null) {
      innerFilter['created_at'] = this.getCreatedAt();
    }

    if (this.getUpdatedAt() !== null) {
      innerFilter['updated_at'] = this.getUpdatedAt();
    }

    if (this.getClosedAt() !== null) {
      innerFilter['closed_at'] = this.getClosedAt();
    }

    if (this.getClosestTaskAt() !== null) {
      innerFilter['closest_task_at'] = this.getClosestTaskAt();
    }

    if (this.getCustomFieldsValues() !== null) {
      innerFilter['custom_fields_values'] = this.getCustomFieldsValues();
    }

    if (this.getStatuses() !== null) {
      innerFilter['statuses'] = this.getStatuses();
    }

    if (this.getPipelineIds() !== null) {
      innerFilter['pipeline_id'] = this.getPipelineIds();
    }

    if (Object.keys(innerFilter).length > 0) {
      filter['filter'] = innerFilter;
    }

    if (this.getQuery() !== null) {
      filter['query'] = this.getQuery();
    }

    if (this.getOrder() !== null) {
      filter['order'] = this.getOrder();
    }

    return this.buildPagesFilter(filter);
  }
}
