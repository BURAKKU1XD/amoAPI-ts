import { Str } from '../Support/Str';
import type { Arrayable } from '../Interfaces/Arrayable';

/**
 * Base abstract model class for all API entities
 */
export abstract class BaseApiModel implements Arrayable {
  /**
   * Convert the model to a plain object
   */
  abstract toArray(): Record<string, unknown>;

  /**
   * Convert the model to API request payload
   * @param requestId Optional request ID for batch operations
   */
  abstract toApi(requestId?: string | number | null): Record<string, unknown>;

  /**
   * Get available "with" relations for this model
   */
  static getAvailableWith(): string[] {
    return [];
  }

  /**
   * Create a model instance from an array/object
   */
  abstract fromArray(data: Record<string, unknown>): this;

  /**
   * Dynamic property getter using method lookup
   */
  protected getProperty<T>(name: string): T | null {
    const methodName = 'get' + Str.studly(name);
    const method = (this as unknown as Record<string, unknown>)[methodName];
    if (typeof method === 'function') {
      return method.call(this) as T;
    }
    return null;
  }

  /**
   * Dynamic property setter using method lookup
   */
  protected setProperty(name: string, value: unknown): void {
    const methodName = 'set' + Str.studly(name);
    const method = (this as unknown as Record<string, unknown>)[methodName];
    if (typeof method === 'function') {
      method.call(this, value);
    }
  }

  /**
   * Convert to JSON string
   */
  toJson(): string {
    return JSON.stringify(this.toArray());
  }
}

/**
 * Type helper for model constructors
 */
export type ModelConstructor<T extends BaseApiModel> = new () => T;
