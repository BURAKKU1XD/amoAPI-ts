import { BaseEntity, ApiResponse } from './BaseEntity';
import type { AmoCRMApiRequest } from '../Client/AmoCRMApiRequest';
import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';
import type { BaseEntityFilter } from '../Filters/BaseEntityFilter';
import { AccountModel } from '../Models/AccountModel';
import { NotAvailableForActionException } from '../Exceptions/NotAvailableForActionException';

type AccountCollection = BaseApiCollection<AccountModel>;
type AccountFilter = BaseEntityFilter;

/**
 * Account entity service
 *
 * Provides access to the current account information.
 * Most standard CRUD operations are not available for this entity.
 */
export class AccountService extends BaseEntity<AccountModel, AccountCollection, AccountFilter> {
  protected method = 'api/v4/account';
  protected collectionClass: any;

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<AccountModel> {
    return AccountModel;
  }

  protected getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[] {
    return [response as unknown as Record<string, unknown>];
  }

  /**
   * Get current account information
   */
  async getCurrent(withRelations: string[] = []): Promise<AccountModel | null> {
    const queryParams: Record<string, string> = {};
    const availableWith = AccountModel.getAvailableWith();
    const validWith = withRelations.filter((w) => availableWith.includes(w));

    if (validWith.length > 0) {
      queryParams['with'] = validWith.join(',');
    }

    const response = await this.request.get(this.method, queryParams);

    if (!response || Object.keys(response).length === 0) {
      return null;
    }

    const entity = new AccountModel();
    return entity.fromArray(response as Record<string, unknown>) as AccountModel;
  }

  async getOne(): Promise<AccountModel | null> {
    throw new NotAvailableForActionException('Use getCurrent for this entity');
  }

  async get(): Promise<AccountCollection | null> {
    throw new NotAvailableForActionException('Use getCurrent for this entity');
  }

  async add(_collection: AccountCollection): Promise<AccountCollection> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async addOne(_model: AccountModel): Promise<AccountModel> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async update(_collection: AccountCollection): Promise<AccountCollection> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async updateOne(_model: AccountModel): Promise<AccountModel> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async syncOne(_model: AccountModel): Promise<AccountModel> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }
}
