import { BaseEntity, ApiResponse } from './BaseEntity';
import type { AmoCRMApiRequest } from '../Client/AmoCRMApiRequest';
import { BaseApiModel, ModelConstructor } from '../Models/BaseApiModel';
import type { BaseApiCollection } from '../Collections/BaseApiCollection';
import type { BaseEntityFilter } from '../Filters/BaseEntityFilter';
import { EntityTypes } from '../Interfaces/EntityTypesInterface';
import { NotAvailableForActionException } from '../Exceptions/NotAvailableForActionException';

type FileModel = BaseApiModel & {
  setId(id: number | null): void;
  setUuid?(uuid: string): void;
  toDeleteApi?(): Record<string, unknown>;
};
type FilesCollection = BaseApiCollection<FileModel>;
type FilesFilter = BaseEntityFilter;

/**
 * Files entity service
 *
 * Provides file upload and management operations in amoCRM.
 * Uses the drive API version endpoint.
 */
export class FilesService extends BaseEntity<FileModel, FilesCollection, FilesFilter> {
  protected method = 'api/v4/files';
  protected collectionClass: any;

  constructor(request: AmoCRMApiRequest) {
    super(request);
    this.collectionClass = null as any;
  }

  protected getItemClass(): ModelConstructor<FileModel> {
    return null as any;
  }

  protected getEntitiesFromResponse(response: ApiResponse): Record<string, unknown>[] {
    return (response._embedded?.[EntityTypes.FILES] || []) as Record<string, unknown>[];
  }

  protected processAdd(collection: FilesCollection, response: ApiResponse): FilesCollection {
    const entities = this.getEntitiesFromResponse(response);
    for (const entity of entities) {
      if ('request_id' in entity) {
        const initialEntity = collection.getBy('requestId', entity['request_id']);
        if (initialEntity) {
          if (entity['id'] !== undefined) initialEntity.setId(entity['id'] as number);
          if (entity['uuid'] !== undefined && initialEntity.setUuid) initialEntity.setUuid(entity['uuid'] as string);
        }
      }
    }
    return collection;
  }

  /**
   * Upload a single file
   */
  async uploadOne(fileData: Record<string, unknown>): Promise<ApiResponse> {
    const response = await this.request.post(this.method, fileData);
    return response;
  }

  /**
   * Delete a single file by UUID
   */
  async deleteOne(uuid: string): Promise<void> {
    await this.request.delete(`${this.method}/${uuid}`);
  }

  async update(_collection: FilesCollection): Promise<FilesCollection> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async updateOne(_model: FileModel): Promise<FileModel> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  async syncOne(_model: FileModel): Promise<FileModel> {
    throw new NotAvailableForActionException('Method not available for this entity');
  }

  // -- Page methods --

  async nextPage(collection: FilesCollection): Promise<FilesCollection | null> {
    const link = collection.getNextPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }

  async prevPage(collection: FilesCollection): Promise<FilesCollection | null> {
    const link = collection.getPrevPageLink();
    if (!link) return null;
    const response = await this.request.get(link);
    return this.createCollection(response);
  }
}
