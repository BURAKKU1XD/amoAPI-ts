import { BaseEntityFilter, FilterParams, RangeFilter } from './BaseEntityFilter';
import { BaseRangeFilter } from './BaseEntityFilter';

/**
 * Order direction type
 */
export type OrderDirection = 'asc' | 'desc';

/**
 * Order configuration
 */
export interface OrderConfig {
  [field: string]: OrderDirection;
}

/**
 * Filter for contacts API endpoint
 */
export class ContactsFilter extends BaseEntityFilter {
  private ids: number[] | null = null;
  private names: string[] | null = null;
  private createdBy: number[] | null = null;
  private updatedBy: number[] | null = null;
  private responsibleUserId: number[] | null = null;
  private createdAt: number | RangeFilter | null = null;
  private updatedAt: number | RangeFilter | null = null;
  private closestTaskAt: number | RangeFilter | null = null;
  private customFieldsValues: Record<string, unknown> | null = null;
  private query: string | null = null;
  private order: OrderConfig | null = null;

  getIds(): number[] | null { return this.ids; }
  setIds(ids: number | number[]): this {
    this.ids = this.parseArrayOrNumberFilter(ids);
    return this;
  }

  getNames(): string[] | null { return this.names; }
  setNames(names: string | string[]): this {
    this.names = this.parseArrayOrStringFilter(names);
    return this;
  }

  getCreatedBy(): number[] | null { return this.createdBy; }
  setCreatedBy(createdBy: number | number[]): this {
    this.createdBy = this.parseArrayOrNumberFilter(createdBy);
    return this;
  }

  getUpdatedBy(): number[] | null { return this.updatedBy; }
  setUpdatedBy(updatedBy: number | number[]): this {
    this.updatedBy = this.parseArrayOrNumberFilter(updatedBy);
    return this;
  }

  getResponsibleUserId(): number[] | null { return this.responsibleUserId; }
  setResponsibleUserId(responsibleUserId: number | number[]): this {
    this.responsibleUserId = this.parseArrayOrNumberFilter(responsibleUserId);
    return this;
  }

  getCreatedAt(): number | RangeFilter | null { return this.createdAt; }
  setCreatedAt(createdAt: number | RangeFilter | null): this {
    this.createdAt = this.parseIntOrIntRangeFilter(createdAt);
    return this;
  }

  getUpdatedAt(): number | RangeFilter | null { return this.updatedAt; }
  setUpdatedAt(updatedAt: number | RangeFilter | null): this {
    this.updatedAt = this.parseIntOrIntRangeFilter(updatedAt);
    return this;
  }

  getClosestTaskAt(): number | RangeFilter | null { return this.closestTaskAt; }
  setClosestTaskAt(closestTaskAt: number | RangeFilter | null): this {
    this.closestTaskAt = this.parseIntOrIntRangeFilter(closestTaskAt);
    return this;
  }

  getCustomFieldsValues(): Record<string, unknown> | null { return this.customFieldsValues; }
  setCustomFieldsValues(values: Record<string, unknown>): this {
    const cfFilter: Record<string, unknown> = {};
    for (const [fieldId, value] of Object.entries(values)) {
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

  getQuery(): string | null { return this.query; }
  setQuery(query: string): this {
    if (query) this.query = String(query);
    return this;
  }

  getOrder(): OrderConfig | null { return this.order; }
  setOrder(order: OrderConfig): this {
    this.order = order;
    return this;
  }

  buildFilter(): FilterParams {
    const filter: FilterParams = {};
    if (this.ids !== null) (filter['filter'] as Record<string, unknown> ?? (filter['filter'] = {})) && ((filter['filter'] as Record<string, unknown>)['id'] = this.ids);
    if (this.names !== null) ((filter['filter'] ??= {}) as Record<string, unknown>)['name'] = this.names;
    if (this.createdBy !== null) ((filter['filter'] ??= {}) as Record<string, unknown>)['created_by'] = this.createdBy;
    if (this.updatedBy !== null) ((filter['filter'] ??= {}) as Record<string, unknown>)['updated_by'] = this.updatedBy;
    if (this.responsibleUserId !== null) ((filter['filter'] ??= {}) as Record<string, unknown>)['responsible_user_id'] = this.responsibleUserId;
    if (this.createdAt !== null) ((filter['filter'] ??= {}) as Record<string, unknown>)['created_at'] = this.createdAt;
    if (this.updatedAt !== null) ((filter['filter'] ??= {}) as Record<string, unknown>)['updated_at'] = this.updatedAt;
    if (this.closestTaskAt !== null) ((filter['filter'] ??= {}) as Record<string, unknown>)['closest_task_at'] = this.closestTaskAt;
    if (this.customFieldsValues !== null) ((filter['filter'] ??= {}) as Record<string, unknown>)['custom_fields_values'] = this.customFieldsValues;
    if (this.query !== null) filter['query'] = this.query;
    if (this.order !== null) filter['order'] = this.order;
    return this.buildPagesFilter(filter);
  }
}
