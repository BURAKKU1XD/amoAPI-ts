import { BaseEntityFilter, FilterParams } from './BaseEntityFilter';

export class WebhooksFilter extends BaseEntityFilter {
  private destination: string | null = null;

  getDestination() { return this.destination; }
  setDestination(d: string | null) { this.destination = d; return this; }

  buildFilter(): FilterParams {
    const filter: FilterParams = {};
    if (this.destination !== null) {
      filter['filter'] = { destination: this.destination };
    }
    return filter;
  }
}
