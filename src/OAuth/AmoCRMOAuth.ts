import axios, { AxiosInstance } from 'axios';
import jwt from 'jsonwebtoken';
import { AccessToken, AccessTokenInterface, AccessTokenData } from './AccessToken';
import { AmoCRMoAuthApiException } from '../Exceptions/AmoCRMoAuthApiException';
import { AmoCRMApiConnectException } from '../Exceptions/AmoCRMApiConnectException';
import { AmoCRMApiErrorResponseException } from '../Exceptions/AmoCRMApiErrorResponseException';
import { DisposableTokenExpiredException } from '../Exceptions/DisposableTokenExpiredException';
import { DisposableTokenVerificationFailedException } from '../Exceptions/DisposableTokenVerificationFailedException';
import { DisposableTokenInvalidDestinationException } from '../Exceptions/DisposableTokenInvalidDestinationException';
import { BadTypeException } from '../Exceptions/BadTypeException';

/**
 * Button colors for OAuth button
 */
export const BUTTON_COLORS: Record<string, string> = {
  default: '#339DC7',
  blue: '#1976D2',
  violet: '#6A1B9A',
  green: '#388E3C',
  orange: '#F57F17',
  red: '#D84315',
};

/**
 * OAuth button options
 */
export interface OAuthButtonOptions {
  title?: string;
  compact?: boolean;
  class_name?: string;
  color?: string;
  state?: string;
  error_callback?: string;
  mode?: 'popup' | 'post_message';
  is_kommo?: boolean;
}

/**
 * Token refresh callback type
 */
export type TokenRefreshCallback = (
  accessToken: AccessTokenInterface,
  baseDomain: string
) => void | Promise<void>;

/**
 * Disposable token model
 */
export interface DisposableTokenModel {
  accountId: number;
  userId: number;
  aud: string;
  iat: number;
  exp: number;
}

/**
 * Account domain model
 */
export interface AccountDomainModel {
  domain: string;
  id: number;
}

/**
 * AmoCRM OAuth client
 */
export class AmoCRMOAuth {
  private static readonly REQUEST_TIMEOUT = 15000;
  private static readonly CONNECT_TIMEOUT = 5000;

  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private baseDomain: string = 'www.amocrm.ru';
  private protocol: string = 'https://';
  private httpClient: AxiosInstance;
  private accessTokenRefreshCallback: TokenRefreshCallback | null = null;

  constructor(clientId: string, clientSecret: string, redirectUri: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;

    this.httpClient = axios.create({
      timeout: AmoCRMOAuth.REQUEST_TIMEOUT,
    });
  }

  /**
   * Get the authorization URL
   */
  getAuthorizeUrl(options: Record<string, string> = {}): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      state: options.state || this.generateState(),
      mode: options.mode || 'post_message',
      ...options,
    });

    return `${this.protocol}${this.baseDomain}/oauth?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async getAccessTokenByCode(code: string): Promise<AccessToken> {
    try {
      const response = await this.httpClient.post(
        `${this.protocol}${this.baseDomain}/oauth2/access_token`,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
          grant_type: 'authorization_code',
          code,
        },
        {
          timeout: AmoCRMOAuth.REQUEST_TIMEOUT,
        }
      );

      return new AccessToken(response.data as AccessTokenData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new AmoCRMoAuthApiException(
          error.message,
          error.response?.status || 0,
          { url: error.config?.url },
          JSON.stringify(error.response?.data)
        );
      }
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async getAccessTokenByRefreshToken(accessToken: AccessTokenInterface): Promise<AccessToken> {
    const refreshToken = accessToken.getRefreshToken();
    if (!refreshToken) {
      throw new AmoCRMoAuthApiException('No refresh token available');
    }

    try {
      const response = await this.httpClient.post(
        `${this.protocol}${this.baseDomain}/oauth2/access_token`,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        },
        {
          timeout: AmoCRMOAuth.REQUEST_TIMEOUT,
        }
      );

      const newToken = new AccessToken(response.data as AccessTokenData);

      // Call refresh callback if set
      if (this.accessTokenRefreshCallback) {
        await this.accessTokenRefreshCallback(newToken, this.baseDomain);
      }

      return newToken;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Try to get account domain and retry
        if (error.response?.status === 401 || error.response?.status === 404) {
          try {
            const accountDomain = await this.getAccountDomainByRefreshToken(accessToken);
            this.setBaseDomain(accountDomain.domain);
            return this.getAccessTokenByRefreshToken(accessToken);
          } catch {
            // Fall through to throw original error
          }
        }

        throw new AmoCRMoAuthApiException(
          error.message,
          error.response?.status || 0,
          { url: error.config?.url },
          JSON.stringify(error.response?.data)
        );
      }
      throw error;
    }
  }

  /**
   * Set the base domain for API requests
   */
  setBaseDomain(domain: string): this {
    this.baseDomain = domain;
    return this;
  }

  /**
   * Get the base domain
   */
  getBaseDomain(): string {
    return this.baseDomain;
  }

  /**
   * Set the protocol (http:// or https://)
   */
  setProtocol(protocol: string): this {
    this.protocol = protocol;
    return this;
  }

  /**
   * Set the redirect URI
   */
  setRedirectUri(redirectUri: string): this {
    this.redirectUri = redirectUri;
    return this;
  }

  /**
   * Get authorization headers for a token
   */
  getAuthorizationHeaders(accessToken: AccessTokenInterface): Record<string, string> {
    return {
      Authorization: `Bearer ${accessToken.getToken()}`,
    };
  }

  /**
   * Get the account URL
   */
  getAccountUrl(): string {
    return `${this.protocol}${this.baseDomain}`;
  }

  /**
   * Set callback for token refresh
   */
  setAccessTokenRefreshCallback(callback: TokenRefreshCallback): this {
    this.accessTokenRefreshCallback = callback;
    return this;
  }

  /**
   * Get account domain by refresh token
   */
  async getAccountDomainByRefreshToken(accessToken: AccessTokenInterface): Promise<AccountDomainModel> {
    const refreshToken = accessToken.getRefreshToken();
    if (!refreshToken) {
      throw new AmoCRMoAuthApiException('No refresh token available');
    }

    try {
      const response = await this.httpClient.get(
        `${this.protocol}api.amocrm.ru/oauth2/account/current/subdomain`,
        {
          headers: {
            'X-Refresh-Token': refreshToken,
          },
          timeout: AmoCRMOAuth.REQUEST_TIMEOUT,
        }
      );

      return response.data as AccountDomainModel;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
          throw new AmoCRMApiConnectException(error.message);
        }
        throw new AmoCRMApiErrorResponseException(
          'Invalid response',
          error.response?.status || 0,
          {},
          JSON.stringify(error.response?.data)
        );
      }
      throw error;
    }
  }

  /**
   * Parse disposable token
   */
  parseDisposableToken(token: string): DisposableTokenModel {
    try {
      const decoded = jwt.verify(token, this.clientSecret, {
        algorithms: ['HS256'],
      }) as jwt.JwtPayload;

      // Check audience
      const clientBaseUri = new URL(this.redirectUri);
      const expectedAud = `${clientBaseUri.protocol}//${clientBaseUri.host}`;

      if (decoded.aud !== expectedAud) {
        throw new DisposableTokenInvalidDestinationException();
      }

      return {
        accountId: decoded.account_id as number,
        userId: decoded.user_id as number,
        aud: decoded.aud as string,
        iat: decoded.iat as number,
        exp: decoded.exp as number,
      };
    } catch (error) {
      if (error instanceof DisposableTokenInvalidDestinationException) {
        throw error;
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new DisposableTokenExpiredException();
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new DisposableTokenVerificationFailedException();
      }
      throw error;
    }
  }

  /**
   * Generate OAuth button HTML
   */
  getOAuthButton(options: OAuthButtonOptions = {}): string {
    if (options.color && !(options.color in BUTTON_COLORS)) {
      throw new BadTypeException('Invalid color selected');
    }

    const title = options.title || 'Install Integration';
    const compact = options.compact ? 'true' : 'false';
    const className = options.class_name || 'className';
    const color = options.color || 'default';
    const errorCallback = options.error_callback || 'handleOauthError';
    const mode = options.mode || 'post_message';
    const state = options.state || this.generateState();

    const mainClassName = options.is_kommo ? 'kommo_oauth' : 'amocrm_oauth';
    const scriptPath = options.is_kommo
      ? 'https://www.kommo.com/auth/button.min.js'
      : 'https://www.amocrm.ru/auth/button.min.js';

    return `<div>
      <script
        class="${mainClassName}"
        charset="utf-8"
        data-client-id="${this.clientId}"
        data-title="${title}"
        data-compact="${compact}"
        data-class-name="${className}"
        data-color="${color}"
        data-state="${state}"
        data-error-callback="${errorCallback}"
        data-mode="${mode}"
        src="${scriptPath}"
      ></script>
    </div>`;
  }

  /**
   * Get the HTTP client
   */
  getHttpClient(): AxiosInstance {
    return this.httpClient;
  }

  /**
   * Generate random state parameter
   */
  private generateState(): string {
    return Math.random().toString(36).substring(2, 22);
  }
}
