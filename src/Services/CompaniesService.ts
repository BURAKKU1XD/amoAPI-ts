import { BaseEntity, ApiResponse } from './BaseEntity';
import type { AmoCRMApiRequest } from '../Client/AmoCRMApiRequest';
import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';
import type { BaseEntityFilter } from '../Filters/BaseEntityFilter';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';

/**
 * Placeholder types
 */
type CompanyModel = BaseApiModel & {
  setId(id: number): void;
  setUpdatedAt(updatedAt: number): void;
};
type CompaniesCollection = BaseApiCollection<CompanyModel>;
type CompaniesFilter = BaseEntityFilter;

/**
 * Companies entity service
 *
 * Provides CRUD operations for company entities in amoCRM.
 * Supports page methods and link methods.
 */
export class CompaniesService extends BaseEntity<CompanyModel, CompaniesCollection, CompaniesFilter> {
  protected method = 'api/v4/companies';
  protected collectionClass: any;

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<CompanyModel> {
    return null as any;
  }

  protected getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[] {
    return (response._embedded?.[EntityTypes.COMPANIES] || []) as Record<string, unknown>[];
  }

  protected processUpdateOne(model: CompanyModel, response: ApiResponse): CompanyModel {
    this.processModelAction(model, response as unknown as Record<string, unknown>);
    return model;
  }

  protected processUpdate(collection: CompaniesCollection, response: ApiResponse): CompaniesCollection {
    return this.processAction(collection, response);
  }

  protected processAdd(collection: CompaniesCollection, response: ApiResponse): CompaniesCollection {
    return this.processAction(collection, response);
  }

  private processAction(collection: CompaniesCollection, response: ApiResponse): CompaniesCollection {
    const entities = this.getEntitiesFromResponse(response);
    for (const entity of entities) {
      if ('request_id' in entity) {
        const initialEntity = collection.getBy('requestId', entity['request_id']);
        if (initialEntity) {
          this.processModelAction(initialEntity, entity);
        }
      }
    }
    return collection;
  }

  private processModelAction(model: CompanyModel, entity: Record<string, unknown>): void {
    if (entity['id'] !== undefined) {
      model.setId(entity['id'] as number);
    }
    if (entity['updated_at'] !== undefined) {
      model.setUpdatedAt(entity['updated_at'] as number);
    }
  }

  // -- Page methods --

  async nextPage(collection: CompaniesCollection): Promise<CompaniesCollection | null> {
    const link = collection.getNextPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }

  async prevPage(collection: CompaniesCollection): Promise<CompaniesCollection | null> {
    const link = collection.getPrevPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }
}
