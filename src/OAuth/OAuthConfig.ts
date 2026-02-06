/**
 * OAuth configuration interface
 */
export interface OAuthConfigInterface {
  /**
   * Get the integration/client ID
   */
  getIntegrationId(): string;

  /**
   * Get the secret key
   */
  getSecretKey(): string;

  /**
   * Get the redirect domain/URI
   */
  getRedirectDomain(): string;
}

/**
 * OAuth configuration implementation
 */
export class OAuthConfig implements OAuthConfigInterface {
  private integrationId: string;
  private secretKey: string;
  private redirectDomain: string;

  constructor(integrationId: string, secretKey: string, redirectDomain: string) {
    this.integrationId = integrationId;
    this.secretKey = secretKey;
    this.redirectDomain = redirectDomain;
  }

  getIntegrationId(): string {
    return this.integrationId;
  }

  getSecretKey(): string {
    return this.secretKey;
  }

  getRedirectDomain(): string {
    return this.redirectDomain;
  }
}
