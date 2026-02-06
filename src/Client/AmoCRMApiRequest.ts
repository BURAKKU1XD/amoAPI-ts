import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { AmoCRMOAuth } from '../OAuth/AmoCRMOAuth';
import type { AccessTokenInterface } from '../OAuth/AccessToken';
import { LongLivedAccessToken } from '../OAuth/AccessToken';
import { AmoCRMApiException } from '../Exceptions/AmoCRMApiException';
import { AmoCRMoAuthApiException } from '../Exceptions/AmoCRMoAuthApiException';
import { AmoCRMApiConnectException } from '../Exceptions/AmoCRMApiConnectException';
import { AmoCRMApiHttpClientException } from '../Exceptions/AmoCRMApiHttpClientException';
import { AmoCRMApiTooManyRequestsException } from '../Exceptions/AmoCRMApiTooManyRequestsException';
import { AmoCRMApiNoContentException } from '../Exceptions/AmoCRMApiNoContentException';
import { AmoCRMApiErrorResponseException } from '../Exceptions/AmoCRMApiErrorResponseException';

/**
 * Request methods
 */
export const RequestMethods = {
  POST: 'POST',
  PUT: 'PUT',
  GET: 'GET',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export type RequestMethod = (typeof RequestMethods)[keyof typeof RequestMethods];

/**
 * HTTP status codes
 */
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
} as const;

/**
 * Success status codes
 */
export const SUCCESS_STATUSES = [
  HttpStatus.OK,
  HttpStatus.CREATED,
  HttpStatus.ACCEPTED,
  HttpStatus.NO_CONTENT,
];

/**
 * Library constants
 */
export const LIBRARY_VERSION = '1.0.0';
export const USER_AGENT = `amoCRM-API-Library-TS/${LIBRARY_VERSION}`;
export const CONNECT_TIMEOUT = 5000;
export const REQUEST_TIMEOUT = 20000;

/**
 * Last request info interface
 */
export interface LastRequestInfo {
  contextUserId?: number | null;
  lastHttpMethod?: string;
  lastMethod?: string;
  lastBody?: unknown;
  lastQueryParams?: Record<string, unknown>;
  lastResponse?: string;
  lastResponseCode?: number;
  lastRequestId?: string;
  timestamp?: number;
}

/**
 * API response type
 */
export interface ApiResponse {
  _embedded?: Record<string, unknown[]>;
  _links?: {
    next?: { href: string };
    prev?: { href: string };
  };
  [key: string]: unknown;
}

/**
 * Token refresh callback type
 */
export type RefreshAccessTokenCallback = () => Promise<AccessTokenInterface>;

/**
 * Custom status check callback type
 */
export type CustomCheckStatusCallback = (
  response: AxiosResponse,
  decodedBody: unknown
) => boolean;

/**
 * AmoCRM API Request handler
 */
export class AmoCRMApiRequest {
  private accessToken: AccessTokenInterface;
  private oAuthClient: AmoCRMOAuth;
  private httpClient: AxiosInstance;
  private contextUserId: number | null;
  private userAgent: string | null;
  private requestDomain: string | null = null;

  // Last request tracking
  private lastHttpMethod: string = '';
  private lastMethod: string = '';
  private lastBody: unknown = {};
  private lastResponse: string = '';
  private lastResponseCode: number = 0;
  private lastQueryParams: Record<string, unknown> = {};
  private lastRequestId: string = '';

  // Callbacks
  private refreshAccessTokenCallback: RefreshAccessTokenCallback;
  private customCheckHttpStatusCallback: CustomCheckStatusCallback | null = null;

  constructor(
    accessToken: AccessTokenInterface,
    oAuthClient: AmoCRMOAuth,
    contextUserId: number | null = null,
    userAgent: string | null = null
  ) {
    this.accessToken = accessToken;
    this.oAuthClient = oAuthClient;
    this.httpClient = oAuthClient.getHttpClient();
    this.contextUserId = contextUserId;
    this.userAgent = userAgent;

    this.refreshAccessTokenCallback = async () => {
      return this.oAuthClient.getAccessTokenByRefreshToken(this.accessToken);
    };
  }

  /**
   * Set custom token refresh callback
   */
  setRefreshAccessTokenCallback(callback: RefreshAccessTokenCallback): void {
    this.refreshAccessTokenCallback = callback;
  }

  /**
   * Set custom HTTP status check callback
   */
  setCustomCheckStatusCallback(callback: CustomCheckStatusCallback): void {
    this.customCheckHttpStatusCallback = callback;
  }

  /**
   * Refresh the access token
   */
  private async refreshAccessToken(): Promise<void> {
    if (this.accessToken instanceof LongLivedAccessToken) {
      throw new AmoCRMoAuthApiException('Cannot update LongLivedAccessToken');
    }

    const newAccessToken = await this.refreshAccessTokenCallback();
    this.accessToken = newAccessToken;
  }

  /**
   * Check if token needs refresh
   */
  private isAccessTokenNeedToBeRefreshed(): boolean {
    return !(this.accessToken instanceof LongLivedAccessToken) && this.accessToken.hasExpired();
  }

  /**
   * Get base headers for requests
   */
  private getBaseHeaders(): Record<string, string> {
    const headers = this.oAuthClient.getAuthorizationHeaders(this.accessToken);

    headers['User-Agent'] = this.getUserAgent();
    headers['X-Library-Version'] = LIBRARY_VERSION;

    if (this.contextUserId !== null) {
      headers['X-Context-User-ID'] = String(this.contextUserId);
    }

    return headers;
  }

  /**
   * Get user agent string
   */
  getUserAgent(): string {
    return this.userAgent ? `${this.userAgent} (${USER_AGENT})` : USER_AGENT;
  }

  /**
   * Get the request URL
   */
  private getUrl(): string {
    if (this.requestDomain) {
      return `${this.requestDomain}/`;
    }
    return this.oAuthClient.getAccountUrl();
  }

  /**
   * Set custom request domain
   */
  setRequestDomain(domain: string | null): void {
    this.requestDomain = domain;
  }

  /**
   * POST request
   */
  async post(
    method: string,
    body: unknown = {},
    queryParams: Record<string, unknown> = {},
    headers: Record<string, string> = {},
    needToRefresh = false,
    isFullPath = false
  ): Promise<ApiResponse> {
    if (this.isAccessTokenNeedToBeRefreshed()) {
      needToRefresh = true;
    }

    if (needToRefresh) {
      await this.refreshAccessToken();
    }

    const allHeaders = { ...headers, ...this.getBaseHeaders() };
    const url = isFullPath ? method : this.getUrl() + method;

    this.lastHttpMethod = RequestMethods.POST;
    this.lastMethod = url;
    this.lastBody = body;
    this.lastQueryParams = queryParams;

    try {
      const response = await this.httpClient.post(url, body, {
        headers: allHeaders,
        params: queryParams,
        timeout: REQUEST_TIMEOUT,
        validateStatus: () => true,
      });

      this.lastRequestId = response.headers['x-request-id'] || '';

      try {
        return this.parseResponse(response);
      } catch (error) {
        if (error instanceof AmoCRMoAuthApiException) {
          if (needToRefresh || this.accessToken instanceof LongLivedAccessToken) {
            throw error;
          }
          return this.post(method, body, queryParams, headers, true, isFullPath);
        }
        throw error;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
          throw new AmoCRMApiConnectException(error.message, 0, this.getLastRequestInfo());
        }
        throw new AmoCRMApiHttpClientException(error.message, 0, this.getLastRequestInfo());
      }
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(
    method: string,
    queryParams: Record<string, unknown> = {},
    headers: Record<string, string> = {},
    needToRefresh = false
  ): Promise<ApiResponse> {
    if (this.isAccessTokenNeedToBeRefreshed()) {
      needToRefresh = true;
    }

    if (needToRefresh) {
      await this.refreshAccessToken();
    }

    const allHeaders = { ...headers, ...this.getBaseHeaders() };
    const url = this.getUrl() + method.replace(this.getUrl(), '');

    this.lastHttpMethod = RequestMethods.GET;
    this.lastMethod = url;
    this.lastBody = {};
    this.lastQueryParams = queryParams;

    try {
      const response = await this.httpClient.get(url, {
        headers: allHeaders,
        params: queryParams,
        timeout: REQUEST_TIMEOUT,
        validateStatus: () => true,
      });

      this.lastRequestId = response.headers['x-request-id'] || '';

      try {
        return this.parseResponse(response);
      } catch (error) {
        if (error instanceof AmoCRMoAuthApiException) {
          if (needToRefresh || this.accessToken instanceof LongLivedAccessToken) {
            throw error;
          }
          return this.get(method, queryParams, headers, true);
        }
        throw error;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
          throw new AmoCRMApiConnectException(error.message, 0, this.getLastRequestInfo());
        }
        throw new AmoCRMApiHttpClientException(error.message, 0, this.getLastRequestInfo());
      }
      throw error;
    }
  }

  /**
   * PATCH request
   */
  async patch(
    method: string,
    body: unknown = {},
    queryParams: Record<string, unknown> = {},
    headers: Record<string, string> = {},
    needToRefresh = false
  ): Promise<ApiResponse> {
    if (this.isAccessTokenNeedToBeRefreshed()) {
      needToRefresh = true;
    }

    if (needToRefresh) {
      await this.refreshAccessToken();
    }

    const allHeaders = { ...headers, ...this.getBaseHeaders() };
    const url = this.getUrl() + method;

    this.lastHttpMethod = RequestMethods.PATCH;
    this.lastMethod = url;
    this.lastBody = body;
    this.lastQueryParams = queryParams;

    try {
      const response = await this.httpClient.patch(url, body, {
        headers: allHeaders,
        params: queryParams,
        timeout: REQUEST_TIMEOUT,
        validateStatus: () => true,
      });

      this.lastRequestId = response.headers['x-request-id'] || '';

      try {
        return this.parseResponse(response);
      } catch (error) {
        if (error instanceof AmoCRMoAuthApiException) {
          if (needToRefresh || this.accessToken instanceof LongLivedAccessToken) {
            throw error;
          }
          return this.patch(method, body, queryParams, headers, true);
        }
        throw error;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
          throw new AmoCRMApiConnectException(error.message, 0, this.getLastRequestInfo());
        }
        throw new AmoCRMApiHttpClientException(error.message, 0, this.getLastRequestInfo());
      }
      throw error;
    }
  }

  /**
   * PUT request
   */
  async put(
    method: string,
    body: unknown = {},
    queryParams: Record<string, unknown> = {},
    headers: Record<string, string> = {},
    needToRefresh = false,
    isFullPath = false
  ): Promise<ApiResponse> {
    if (this.isAccessTokenNeedToBeRefreshed()) {
      needToRefresh = true;
    }

    if (needToRefresh) {
      await this.refreshAccessToken();
    }

    const allHeaders = { ...headers, ...this.getBaseHeaders() };
    const url = isFullPath ? method : this.getUrl() + method;

    this.lastHttpMethod = RequestMethods.PUT;
    this.lastMethod = url;
    this.lastBody = body;
    this.lastQueryParams = queryParams;

    try {
      const response = await this.httpClient.put(url, body, {
        headers: allHeaders,
        params: queryParams,
        timeout: REQUEST_TIMEOUT,
        validateStatus: () => true,
      });

      this.lastRequestId = response.headers['x-request-id'] || '';

      try {
        return this.parseResponse(response);
      } catch (error) {
        if (error instanceof AmoCRMoAuthApiException) {
          if (needToRefresh || this.accessToken instanceof LongLivedAccessToken) {
            throw error;
          }
          return this.put(method, body, queryParams, headers, true, isFullPath);
        }
        throw error;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
          throw new AmoCRMApiConnectException(error.message, 0, this.getLastRequestInfo());
        }
        throw new AmoCRMApiHttpClientException(error.message, 0, this.getLastRequestInfo());
      }
      throw error;
    }
  }

  /**
   * DELETE request
   */
  async delete(
    method: string,
    body: unknown = {},
    queryParams: Record<string, unknown> = {},
    headers: Record<string, string> = {},
    needToRefresh = false
  ): Promise<ApiResponse> {
    if (this.isAccessTokenNeedToBeRefreshed()) {
      needToRefresh = true;
    }

    if (needToRefresh) {
      await this.refreshAccessToken();
    }

    const allHeaders = { ...headers, ...this.getBaseHeaders() };
    const url = this.getUrl() + method;

    this.lastHttpMethod = RequestMethods.DELETE;
    this.lastMethod = url;
    this.lastBody = body;
    this.lastQueryParams = queryParams;

    try {
      const response = await this.httpClient.delete(url, {
        headers: allHeaders,
        params: queryParams,
        data: body,
        timeout: REQUEST_TIMEOUT,
        validateStatus: () => true,
      });

      this.lastRequestId = response.headers['x-request-id'] || '';

      try {
        return this.parseResponse(response);
      } catch (error) {
        if (error instanceof AmoCRMoAuthApiException) {
          if (needToRefresh || this.accessToken instanceof LongLivedAccessToken) {
            throw error;
          }
          return this.delete(method, body, queryParams, headers, true);
        }
        if (error instanceof AmoCRMApiNoContentException) {
          return { result: true };
        }
        throw error;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
          throw new AmoCRMApiConnectException(error.message, 0, this.getLastRequestInfo());
        }
        throw new AmoCRMApiHttpClientException(error.message, 0, this.getLastRequestInfo());
      }
      throw error;
    }
  }

  /**
   * Parse API response
   */
  private parseResponse(response: AxiosResponse): ApiResponse {
    const bodyContents = typeof response.data === 'string'
      ? response.data
      : JSON.stringify(response.data);
    this.lastResponse = bodyContents;

    const decodedBody = typeof response.data === 'object'
      ? response.data
      : JSON.parse(bodyContents || '{}');

    if (
      response.status !== HttpStatus.ACCEPTED &&
      !decodedBody &&
      bodyContents
    ) {
      if (response.status === HttpStatus.TOO_MANY_REQUESTS) {
        throw new AmoCRMApiTooManyRequestsException(
          'Too many requests',
          response.status,
          this.getLastRequestInfo()
        );
      }

      throw new AmoCRMApiException(
        'Response body is not json',
        response.status,
        this.getLastRequestInfo()
      );
    }

    this.checkHttpStatus(response, decodedBody);

    return decodedBody || {};
  }

  /**
   * Check HTTP status code
   */
  private checkHttpStatus(response: AxiosResponse, decodedBody: Record<string, unknown> = {}): void {
    this.lastResponseCode = response.status;

    // Custom callback check
    if (
      this.customCheckHttpStatusCallback &&
      this.customCheckHttpStatusCallback(response, decodedBody)
    ) {
      return;
    }

    if (response.status === HttpStatus.UNAUTHORIZED) {
      throw new AmoCRMoAuthApiException(
        'Unauthorized',
        response.status,
        this.getLastRequestInfo(),
        decodedBody.detail as string || ''
      );
    }

    if (response.status === HttpStatus.NO_CONTENT) {
      throw new AmoCRMApiNoContentException(
        'No content',
        response.status,
        this.getLastRequestInfo()
      );
    }

    if (!SUCCESS_STATUSES.includes(response.status)) {
      if (
        response.status === HttpStatus.BAD_REQUEST &&
        decodedBody['validation-errors']
      ) {
        const exception = new AmoCRMApiErrorResponseException(
          'Response has validation errors',
          response.status,
          this.getLastRequestInfo(),
          decodedBody.detail as string || ''
        );
        throw exception;
      }

      throw new AmoCRMApiException(
        'Invalid http status',
        response.status,
        this.getLastRequestInfo(),
        decodedBody.detail as string || ''
      );
    }
  }

  /**
   * Get last request info for debugging
   */
  getLastRequestInfo(): LastRequestInfo {
    return {
      contextUserId: this.contextUserId,
      lastHttpMethod: this.lastHttpMethod,
      lastMethod: this.lastMethod,
      lastBody: this.lastBody,
      lastQueryParams: this.lastQueryParams,
      lastResponse: this.lastResponse,
      lastResponseCode: this.lastResponseCode,
      lastRequestId: this.lastRequestId,
      timestamp: Math.floor(Date.now() / 1000),
    };
  }
}
