import type { LinkModel } from '../Models/LinkModel';

/**
 * Interface for entities that can be linked to other entities
 */
export interface CanBeLinkedInterface {
  /**
   * Get the link model for this entity
   */
  getLink(): LinkModel;
}
