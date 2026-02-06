import type { BaseApiModel } from '../Models/BaseApiModel';

/**
 * Interface for services that support delete operations
 */
export interface HasDeleteMethodInterface {
  /**
   * Delete a single entity
   * @param model The entity model to delete
   */
  deleteOne(model: BaseApiModel): Promise<boolean>;
}
