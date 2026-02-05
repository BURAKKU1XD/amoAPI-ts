/**
 * Interface for entities that have a type
 */
export interface TypeAwareInterface {
  /**
   * Get the entity type
   */
  getType(): string;
}
