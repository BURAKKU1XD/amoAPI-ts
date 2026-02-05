/**
 * Range filter interface for value ranges
 */
export interface RangeFilter {
  from?: number;
  to?: number;
}

/**
 * Filter query parameters type
 */
export type FilterParams = Record<string, unknown>;

/**
 * Base class for entity filters
 */
export abstract class BaseEntityFilter {
  protected limit: number | null = null;
  protected page: number | null = null;

  /**
   * Build the filter query parameters
   */
  abstract buildFilter(): FilterParams;

  /**
   * Get limit
   */
  getLimit(): number | null {
    return this.limit;
  }

  /**
   * Set limit for pagination
   */
  setLimit(limit: number): this {
    this.limit = limit;
    return this;
  }

  /**
   * Get page
   */
  getPage(): number | null {
    return this.page;
  }

  /**
   * Set page for pagination
   */
  setPage(page: number): this {
    this.page = page;
    return this;
  }

  /**
   * Build pagination filter
   */
  protected buildPagesFilter(filter: FilterParams): FilterParams {
    if (this.limit !== null) {
      filter['limit'] = this.limit;
    }
    if (this.page !== null) {
      filter['page'] = this.page;
    }
    return filter;
  }

  /**
   * Parse array or number filter value
   */
  protected parseArrayOrNumberFilter(value: number | number[]): number[] {
    if (Array.isArray(value)) {
      return value.filter((v) => typeof v === 'number' && v > 0).map((v) => Number(v));
    }
    return typeof value === 'number' && value > 0 ? [value] : [];
  }

  /**
   * Parse array or string filter value
   */
  protected parseArrayOrStringFilter(value: string | string[]): string[] {
    if (Array.isArray(value)) {
      return value.filter((v) => typeof v === 'string' && v.length > 0);
    }
    return typeof value === 'string' && value.length > 0 ? [value] : [];
  }

  /**
   * Parse int or int range filter
   */
  protected parseIntOrIntRangeFilter(
    value: number | RangeFilter | null
  ): number | RangeFilter | null {
    if (value === null) {
      return null;
    }
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'object' && ('from' in value || 'to' in value)) {
      return value;
    }
    return null;
  }
}

/**
 * Base range filter class
 */
export class BaseRangeFilter {
  protected from: number | null = null;
  protected to: number | null = null;

  /**
   * Get from value
   */
  getFrom(): number | null {
    return this.from;
  }

  /**
   * Set from value
   */
  setFrom(from: number): this {
    this.from = from;
    return this;
  }

  /**
   * Get to value
   */
  getTo(): number | null {
    return this.to;
  }

  /**
   * Set to value
   */
  setTo(to: number): this {
    this.to = to;
    return this;
  }

  /**
   * Convert to filter object
   */
  toFilter(): RangeFilter {
    const filter: RangeFilter = {};
    if (this.from !== null) {
      filter.from = this.from;
    }
    if (this.to !== null) {
      filter.to = this.to;
    }
    return filter;
  }
}
