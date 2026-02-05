import type { BaseEntityFilter } from '../Filters/BaseEntityFilter';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';

/**
 * Interface for services that support pagination methods
 */
export interface HasPageMethodsInterface<
  TCollection extends BaseApiCollection<unknown>,
  TFilter extends BaseEntityFilter
> {
  /**
   * Get the next page of results
   * @param collection The current collection with page links
   */
  nextPage(collection: TCollection): Promise<TCollection | null>;

  /**
   * Get the previous page of results
   * @param collection The current collection with page links
   */
  prevPage(collection: TCollection): Promise<TCollection | null>;
}
