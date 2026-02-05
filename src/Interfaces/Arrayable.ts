/**
 * Interface for objects that can be converted to arrays
 */
export interface Arrayable<T = Record<string, unknown>> {
  /**
   * Convert the object to an array/plain object
   */
  toArray(): T;
}
