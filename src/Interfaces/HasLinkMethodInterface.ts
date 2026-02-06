import type { LinksCollection } from '../Collections/LinksCollection';
import type { BaseApiModel } from '../Models/BaseApiModel';

/**
 * Interface for services that support entity linking methods
 */
export interface HasLinkMethodInterface {
  /**
   * Get links for an entity
   * @param model The entity model
   * @param filter Optional filter parameters
   */
  getLinks(model: BaseApiModel, filter?: string[]): Promise<LinksCollection>;

  /**
   * Link entities together
   * @param model The main entity model
   * @param links The collection of links to add
   */
  link(model: BaseApiModel, links: LinksCollection): Promise<LinksCollection>;

  /**
   * Unlink entities
   * @param model The main entity model
   * @param links The collection of links to remove
   */
  unlink(model: BaseApiModel, links: LinksCollection): Promise<boolean>;
}
