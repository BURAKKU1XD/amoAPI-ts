import { BaseEntity, ApiResponse } from './BaseEntity';
import type { AmoCRMApiRequest } from '../Client/AmoCRMApiRequest';
import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';
import type { BaseEntityFilter } from '../Filters/BaseEntityFilter';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';
import { NotAvailableForActionException } from '../Exceptions/NotAvailableForActionException';

/**
 * Placeholder types - replace with actual imports when models/collections/filters are created
 */
type LeadModel = BaseApiModel & {
  setId(id: number): void;
  setUpdatedAt(updatedAt: number): void;
  setComplexRequestIds?(requestIds: string[]): void;
  setIsMerged?(isMerged: boolean): void;
  setContacts?(contacts: unknown): void;
  setCompany?(company: unknown): void;
};
type LeadsCollection = BaseApiCollection<LeadModel> & {
  toComplexApi?(): unknown[];
};
type LeadsFilter = BaseEntityFilter;

/**
 * Leads entity service
 *
 * Provides CRUD operations for lead entities in amoCRM.
 * Supports page methods and link methods.
 */
export class LeadsService extends BaseEntity<LeadModel, LeadsCollection, LeadsFilter> {
  protected method = 'api/v4/leads';
  protected collectionClass: any;

  constructor(request: AmoCRMApiRequest) {
    super(request);
    // Will be set to actual LeadsCollection when available
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<LeadModel> {
    // Will return actual LeadModel when available
    return null as any;
  }

  protected getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[] {
    return (response._embedded?.[EntityTypes.LEADS] || []) as Record<string, unknown>[];
  }

  /**
   * Process update response for a single model
   */
  protected processUpdateOne(model: LeadModel, response: ApiResponse): LeadModel {
    this.processModelAction(model, response as unknown as Record<string, unknown>);
    return model;
  }

  /**
   * Process update response for collection
   */
  protected processUpdate(collection: LeadsCollection, response: ApiResponse): LeadsCollection {
    return this.processAction(collection, response);
  }

  /**
   * Process add response for collection
   */
  protected processAdd(collection: LeadsCollection, response: ApiResponse): LeadsCollection {
    return this.processAction(collection, response);
  }

  /**
   * Process action - match response entities to collection items by request_id
   */
  private processAction(collection: LeadsCollection, response: ApiResponse): LeadsCollection {
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

  /**
   * Process individual model action - set id and updated_at from response
   */
  private processModelAction(model: LeadModel, entity: Record<string, unknown>): void {
    if (entity['id'] !== undefined) {
      model.setId(entity['id'] as number);
    }
    if (entity['updated_at'] !== undefined) {
      model.setUpdatedAt(entity['updated_at'] as number);
    }
  }

  /**
   * Add complex lead with contacts and companies
   */
  async addComplex(collection: LeadsCollection): Promise<LeadsCollection> {
    if (!collection.toComplexApi) {
      throw new NotAvailableForActionException('Collection does not support complex API');
    }
    const response = await this.request.post(this.getComplexMethod(), collection.toComplexApi());
    return this.processComplexAction(response);
  }

  /**
   * Add a single complex lead
   */
  async addOneComplex(model: LeadModel): Promise<LeadModel> {
    const CollectionClass = this.collectionClass;
    const collection = new CollectionClass() as LeadsCollection;
    collection.add(model);
    const resultCollection = await this.addComplex(collection);
    return resultCollection.first()!;
  }

  /**
   * Get complex method endpoint
   */
  private getComplexMethod(): string {
    return this.method + '/complex';
  }

  /**
   * Process complex add action response
   */
  private processComplexAction(response: ApiResponse): LeadsCollection {
    const CollectionClass = this.collectionClass;
    const resultCollection = new CollectionClass() as LeadsCollection;
    const responseArray = response as unknown as Record<string, unknown>[];

    if (Array.isArray(responseArray)) {
      for (const responseLead of responseArray) {
        const ItemClass = this.getItemClass();
        const lead = new ItemClass() as LeadModel;
        lead.setId(responseLead['id'] as number);
        if (lead.setComplexRequestIds) {
          lead.setComplexRequestIds(responseLead['request_id'] as string[]);
        }
        if (lead.setIsMerged) {
          lead.setIsMerged(Boolean(responseLead['merged']));
        }
        resultCollection.add(lead);
      }
    }

    return resultCollection;
  }

  // -- Page methods --

  /**
   * Get next page of results
   */
  async nextPage(collection: LeadsCollection): Promise<LeadsCollection | null> {
    const link = collection.getNextPageLink();
    if (!link) {
      return null;
    }
    const response = await this.request.get(link);
    return this.createCollection(response);
  }

  /**
   * Get previous page of results
   */
  async prevPage(collection: LeadsCollection): Promise<LeadsCollection | null> {
    const link = collection.getPrevPageLink();
    if (!link) {
      return null;
    }
    const response = await this.request.get(link);
    return this.createCollection(response);
  }
}
