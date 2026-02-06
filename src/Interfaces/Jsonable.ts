/**
 * Interface for objects that can be converted to JSON
 */
export interface Jsonable {
  /**
   * Convert the object to JSON string
   * @param options Optional JSON stringify options
   */
  toJson(options?: number): string;
}
