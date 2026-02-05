/**
 * Access token interface
 */
export interface AccessTokenInterface {
  /**
   * Get the access token string
   */
  getToken(): string;

  /**
   * Get the refresh token string
   */
  getRefreshToken(): string | null;

  /**
   * Get the expiration timestamp
   */
  getExpires(): number | null;

  /**
   * Check if the token has expired
   */
  hasExpired(): boolean;
}

/**
 * Access token data structure
 */
export interface AccessTokenData {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  expires?: number;
}

/**
 * Access token implementation
 */
export class AccessToken implements AccessTokenInterface {
  private accessToken: string;
  private refreshToken: string | null;
  private expires: number | null;
  private tokenType: string;

  constructor(data: AccessTokenData) {
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token || null;
    this.tokenType = data.token_type || 'Bearer';

    // Calculate expiration
    if (data.expires) {
      this.expires = data.expires;
    } else if (data.expires_in) {
      this.expires = Math.floor(Date.now() / 1000) + data.expires_in;
    } else {
      this.expires = null;
    }
  }

  getToken(): string {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  getExpires(): number | null {
    return this.expires;
  }

  getTokenType(): string {
    return this.tokenType;
  }

  hasExpired(): boolean {
    if (this.expires === null) {
      return false;
    }
    return Math.floor(Date.now() / 1000) >= this.expires;
  }

  /**
   * Convert to plain object
   */
  toArray(): AccessTokenData {
    return {
      access_token: this.accessToken,
      refresh_token: this.refreshToken || undefined,
      expires: this.expires || undefined,
      token_type: this.tokenType,
    };
  }

  /**
   * Create from plain object
   */
  static fromArray(data: AccessTokenData): AccessToken {
    return new AccessToken(data);
  }
}

/**
 * Long-lived access token that doesn't expire
 */
export class LongLivedAccessToken extends AccessToken {
  constructor(accessToken: string) {
    super({
      access_token: accessToken,
      token_type: 'Bearer',
    });
  }

  hasExpired(): boolean {
    return false;
  }

  getRefreshToken(): string | null {
    return null;
  }
}
