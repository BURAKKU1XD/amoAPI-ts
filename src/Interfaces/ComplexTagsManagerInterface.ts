/**
 * Interface for models that support complex tag management
 * Uses tags_to_add and tags_to_delete format
 */
export interface ComplexTagsManagerInterface {
  /**
   * Mutate tags for API requests
   * @param entity The entity data
   */
  mutateTags(entity: Record<string, unknown>): Record<string, unknown>;
}
