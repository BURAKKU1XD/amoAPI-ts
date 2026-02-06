import { BaseEntityFilter, FilterParams } from './BaseEntityFilter';

export class PagesFilter extends BaseEntityFilter {
  private url: string | null = null;

  getUrl() { return this.url; }
  setUrl(url: string) { this.url = url; return this; }

  buildFilter(): FilterParams {
    return this.buildPagesFilter({});
  }
}
