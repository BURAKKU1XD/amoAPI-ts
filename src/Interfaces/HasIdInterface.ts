/**
 * Interface for entities that have an ID
 */
export interface HasIdInterface {
  /**
   * Get the entity ID
   */
  getId(): number | null;
}
