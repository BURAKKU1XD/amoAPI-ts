/**
 * Interface for entities that can be serialized for API requests
 */
export interface EntityApiInterface {
  /**
   * Returns the entity representation for related entities
   */
  toEntityApi(): Record<string, unknown> | null;
}
