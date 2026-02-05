import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import { Str } from '../Support/Str';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';
import type { Arrayable } from '../Interfaces/Arrayable';
import type { Jsonable } from '../Interfaces/Jsonable';

/**
 * Pagination links interface
 */
export interface PageLinks {
  nextPageLink?: string | null;
  prevPageLink?: string | null;
}

/**
 * Base collection class for API entity collections
 */
export abstract class BaseApiCollection<T extends BaseApiModel>
  implements Arrayable, Jsonable, Iterable<T>
{
  /**
   * Item class for this collection - must be overridden in subclasses
   */
  protected static readonly ITEM_CLASS: ModelConstructor<BaseApiModel>;

  /**
   * Collection data storage
   */
  protected data: T[] = [];

  /**
   * Pagination links
   */
  protected nextPageLink: string | null = null;
  protected prevPageLink: string | null = null;

  /**
   * Get the item class for this collection
   */
  protected abstract getItemClass(): ModelConstructor<T>;

  /**
   * Validate that item is of correct type
   */
  protected checkItem(item: T): T {
    const ItemClass = this.getItemClass();
    if (!(item instanceof ItemClass)) {
      throw new InvalidArgumentException(`Item must be an instance of ${ItemClass.name}`);
    }
    return item;
  }

  /**
   * Create collection from array of raw data
   */
  static fromArray<C extends BaseApiCollection<T>, T extends BaseApiModel>(
    this: new () => C,
    array: Record<string, unknown>[]
  ): C {
    const collection = new this();
    for (const item of array) {
      const ItemClass = collection.getItemClass();
      const entity = new ItemClass();
      collection.add(entity.fromArray(item) as T);
    }
    return collection;
  }

  /**
   * Create collection from array of model instances
   */
  static make<C extends BaseApiCollection<T>, T extends BaseApiModel>(
    this: new () => C,
    items: T[]
  ): C {
    const collection = new this();
    for (const item of items) {
      collection.add(item);
    }
    return collection;
  }

  /**
   * Add an item to the collection
   */
  add(item: T): this {
    this.data.push(this.checkItem(item));
    return this;
  }

  /**
   * Add an item to the beginning of the collection
   */
  prepend(item: T): this {
    this.data.unshift(this.checkItem(item));
    return this;
  }

  /**
   * Get all items
   */
  all(): T[] {
    return this.data;
  }

  /**
   * Get the first item
   */
  first(): T | null {
    return this.data[0] || null;
  }

  /**
   * Get the last item
   */
  last(): T | null {
    return this.data[this.data.length - 1] || null;
  }

  /**
   * Get item at index
   */
  get(index: number): T | null {
    return this.data[index] || null;
  }

  /**
   * Set item at index
   */
  set(index: number, item: T): void {
    this.data[index] = this.checkItem(item);
  }

  /**
   * Remove item at index
   */
  remove(index: number): void {
    this.data.splice(index, 1);
  }

  /**
   * Check if index exists
   */
  has(index: number): boolean {
    return index >= 0 && index < this.data.length;
  }

  /**
   * Clear the collection
   */
  clear(): this {
    this.data = [];
    return this;
  }

  /**
   * Get collection length
   */
  count(): number {
    return this.data.length;
  }

  /**
   * Get collection keys (indices)
   */
  keys(): number[] {
    return this.data.map((_, index) => index);
  }

  /**
   * Check if collection is empty
   */
  isEmpty(): boolean {
    return this.data.length === 0;
  }

  /**
   * Convert collection to array
   */
  toArray(): Record<string, unknown>[] {
    return this.data.map((item) => item.toArray());
  }

  /**
   * Convert collection to API payload
   */
  toApi(): Record<string, unknown>[] | null {
    return this.data.map((item, index) => item.toApi(index));
  }

  /**
   * Convert to JSON string
   */
  toJson(): string {
    return JSON.stringify(this.toArray());
  }

  /**
   * Convert to string
   */
  toString(): string {
    return this.toJson();
  }

  /**
   * Get iterator for for...of loops
   */
  [Symbol.iterator](): Iterator<T> {
    let index = 0;
    const data = this.data;
    return {
      next(): IteratorResult<T> {
        if (index < data.length) {
          return { value: data[index++], done: false };
        }
        return { value: undefined as unknown as T, done: true };
      },
    };
  }

  /**
   * ForEach implementation
   */
  forEach(callback: (item: T, index: number, collection: this) => void): void {
    this.data.forEach((item, index) => callback(item, index, this));
  }

  /**
   * Map implementation
   */
  map<U>(callback: (item: T, index: number) => U): U[] {
    return this.data.map(callback);
  }

  /**
   * Filter implementation
   */
  filter(callback: (item: T, index: number) => boolean): T[] {
    return this.data.filter(callback);
  }

  /**
   * Find item by property value
   */
  getBy<K extends string>(key: K, value: unknown): T | null {
    const getter = 'get' + Str.studly(key);
    for (const item of this.data) {
      const method = (item as unknown as Record<string, unknown>)[getter];
      if (typeof method === 'function') {
        const fieldValue = method.call(item);
        if (fieldValue === value) {
          return item;
        }
      }
    }
    return null;
  }

  /**
   * Replace item by property value
   */
  replaceBy<K extends string>(key: K, value: unknown, replacement: T): void {
    const getter = 'get' + Str.studly(key);
    for (let i = 0; i < this.data.length; i++) {
      const item = this.data[i];
      const method = (item as unknown as Record<string, unknown>)[getter];
      if (typeof method === 'function') {
        const fieldValue = method.call(item);
        if (fieldValue === value) {
          this.data[i] = replacement;
          return;
        }
      }
    }
  }

  /**
   * Remove all items matching property value
   */
  removeBy<K extends string>(key: K, value: unknown): number {
    const getter = 'get' + Str.studly(key);
    let count = 0;
    this.data = this.data.filter((item) => {
      const method = (item as unknown as Record<string, unknown>)[getter];
      if (typeof method === 'function') {
        const fieldValue = method.call(item);
        if (fieldValue === value) {
          count++;
          return false;
        }
      }
      return true;
    });
    return count;
  }

  /**
   * Remove first item matching property value
   */
  removeFirstBy<K extends string>(key: K, value: unknown): boolean {
    const getter = 'get' + Str.studly(key);
    for (let i = 0; i < this.data.length; i++) {
      const item = this.data[i];
      const method = (item as unknown as Record<string, unknown>)[getter];
      if (typeof method === 'function') {
        const fieldValue = method.call(item);
        if (fieldValue === value) {
          this.data.splice(i, 1);
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Split collection into chunks
   */
  chunk(size: number): this[] {
    if (this.count() <= size) {
      return [this];
    }
    const result: this[] = [];
    const Constructor = this.constructor as new () => this;
    for (let i = 0; i < this.data.length; i += size) {
      const chunk = new Constructor();
      for (let j = i; j < Math.min(i + size, this.data.length); j++) {
        chunk.add(this.data[j]);
      }
      result.push(chunk);
    }
    return result;
  }

  /**
   * Extract column values
   */
  pluck(column: string): Record<number, unknown> {
    const result: Record<number, unknown> = {};
    this.data.forEach((item, index) => {
      const arr = item.toArray();
      if (!(column in arr)) {
        throw new InvalidArgumentException(`Some elements missing keys "${column}"`);
      }
      result[index] = arr[column];
    });
    return result;
  }

  /**
   * Merge with another collection
   */
  merge(items: this): this {
    const Constructor = this.constructor as new () => this;
    const result = new Constructor();
    for (const item of this.data) {
      result.add(item);
    }
    for (const item of items.all()) {
      result.add(item);
    }
    return result;
  }

  /**
   * Get next page link
   */
  getNextPageLink(): string | null {
    return this.nextPageLink;
  }

  /**
   * Set next page link
   */
  setNextPageLink(link: string | null): this {
    this.nextPageLink = link;
    return this;
  }

  /**
   * Get previous page link
   */
  getPrevPageLink(): string | null {
    return this.prevPageLink;
  }

  /**
   * Set previous page link
   */
  setPrevPageLink(link: string | null): this {
    this.prevPageLink = link;
    return this;
  }
}
