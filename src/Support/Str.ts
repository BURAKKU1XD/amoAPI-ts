/**
 * String utility class with caching for performance
 */
export class Str {
  /**
   * Cache of camel-cased words
   */
  private static camelCache: Map<string, string> = new Map();

  /**
   * Cache of studly-cased words
   */
  private static studlyCache: Map<string, string> = new Map();

  /**
   * Convert the given string to upper-case
   */
  static upper(value: string): string {
    return value.toUpperCase();
  }

  /**
   * Returns the portion of the string specified by the start and length parameters
   */
  static substr(string: string, start: number, length?: number): string {
    if (length === undefined) {
      return string.substring(start);
    }
    return string.substring(start, start + length);
  }

  /**
   * Make a string's first character uppercase
   */
  static ucfirst(string: string): string {
    return this.upper(this.substr(string, 0, 1)) + this.substr(string, 1);
  }

  /**
   * Convert a value to studly caps case (PascalCase)
   */
  static studly(value: string): string {
    const key = value;

    if (this.studlyCache.has(key)) {
      return this.studlyCache.get(key)!;
    }

    const words = this.replace(['-', '_'], ' ', value).split(' ');
    const studlyWords = words.map((word) => this.ucfirst(word));
    const result = studlyWords.join('');

    this.studlyCache.set(key, result);
    return result;
  }

  /**
   * Convert a value to camel case
   */
  static camel(value: string): string {
    if (this.camelCache.has(value)) {
      return this.camelCache.get(value)!;
    }

    const studly = this.studly(value);
    const result = studly.charAt(0).toLowerCase() + studly.slice(1);

    this.camelCache.set(value, result);
    return result;
  }

  /**
   * Replace the given value in the given string
   */
  static replace(
    search: string | string[],
    replace: string | string[],
    subject: string
  ): string {
    if (Array.isArray(search)) {
      let result = subject;
      search.forEach((s, index) => {
        const r = Array.isArray(replace) ? replace[index] || '' : replace;
        result = result.split(s).join(r);
      });
      return result;
    }
    return subject.split(search).join(Array.isArray(replace) ? replace[0] : replace);
  }

  /**
   * Convert a value to snake_case
   */
  static snake(value: string, delimiter = '_'): string {
    let result = value.replace(/([A-Z])/g, (match) => delimiter + match.toLowerCase());
    if (result.startsWith(delimiter)) {
      result = result.substring(1);
    }
    return result;
  }

  /**
   * Convert a value to kebab-case
   */
  static kebab(value: string): string {
    return this.snake(value, '-');
  }

  /**
   * Clear the caches
   */
  static clearCache(): void {
    this.camelCache.clear();
    this.studlyCache.clear();
  }
}
