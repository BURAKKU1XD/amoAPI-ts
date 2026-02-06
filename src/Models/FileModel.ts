import { BaseApiModel } from './BaseApiModel';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';

/**
 * File model
 */
export class FileModel extends BaseApiModel {
  static readonly DELETED = 'deleted';
  static readonly UNBILLED = 'unbilled';

  protected id: number | null = null;
  protected uuid: string | null = null;
  protected versionUuid: string | null = null;
  protected versionUuidChanged = false;
  protected name: string | null = null;
  protected nameChanged = false;
  protected size: number | null = null;
  protected mimeType: string | null = null;
  protected extension: string | null = null;
  protected createdAt: number | null = null;
  protected createdBy: number | null = null;
  protected createdByChanged = false;
  protected createdByType: string | null = null;
  protected updatedAt: number | null = null;
  protected updatedBy: number | null = null;
  protected updatedByChanged = false;
  protected updatedByType: string | null = null;
  protected deletedAt: number | null = null;
  protected deletedBy: number | null = null;
  protected deletedByType: string | null = null;
  protected hasMultipleVersions: boolean | null = null;
  protected isTrashed: boolean | null = null;
  protected sanitizedName: string | null = null;
  protected sourceId: number | null = null;
  protected downloadLink: string | null = null;
  protected downloadVersionLink: string | null = null;
  protected type: string | null = null;
  protected previews: Record<string, unknown>[] | null = null;
  protected requestId: string | null = null;

  getId() { return this.id; }
  setId(id: number | null) { this.id = id; return this; }
  getUuid() { return this.uuid; }
  setUuid(uuid: string | null) { this.uuid = uuid; return this; }
  getVersionUuid() { return this.versionUuid; }
  setVersionUuid(versionUuid: string | null) { this.versionUuid = versionUuid; this.versionUuidChanged = true; return this; }
  getName() { return this.name; }
  setName(name: string | null) { this.name = name; this.nameChanged = true; return this; }
  getNameWithExtension() { return `${this.name}.${this.extension}`; }
  getSize() { return this.size; }
  setSize(size: number | null) { this.size = size; return this; }
  getMimeType() { return this.mimeType; }
  setMimeType(mimeType: string | null) { this.mimeType = mimeType; return this; }
  getExtension() { return this.extension; }
  setExtension(extension: string | null) { this.extension = extension; return this; }
  getCreatedAt() { return this.createdAt; }
  setCreatedAt(createdAt: number | null) { this.createdAt = createdAt; return this; }
  getCreatedBy() { return this.createdBy; }
  setCreatedBy(createdBy: number | null) { this.createdBy = createdBy; this.createdByChanged = true; return this; }
  getCreatedByType() { return this.createdByType; }
  setCreatedByType(createdByType: string | null) { this.createdByType = createdByType; return this; }
  getUpdatedAt() { return this.updatedAt; }
  setUpdatedAt(updatedAt: number | null) { this.updatedAt = updatedAt; return this; }
  getUpdatedBy() { return this.updatedBy; }
  setUpdatedBy(updatedBy: number | null) { this.updatedBy = updatedBy; this.updatedByChanged = true; return this; }
  getUpdatedByType() { return this.updatedByType; }
  setUpdatedByType(updatedByType: string | null) { this.updatedByType = updatedByType; return this; }
  getDeletedAt() { return this.deletedAt; }
  setDeletedAt(deletedAt: number | null) { this.deletedAt = deletedAt; return this; }
  getDeletedBy() { return this.deletedBy; }
  setDeletedBy(deletedBy: number | null) { this.deletedBy = deletedBy; return this; }
  getDeletedByType() { return this.deletedByType; }
  setDeletedByType(deletedByType: string | null) { this.deletedByType = deletedByType; return this; }
  getHasMultipleVersions() { return this.hasMultipleVersions; }
  setHasMultipleVersions(hasMultipleVersions: boolean | null) { this.hasMultipleVersions = hasMultipleVersions; return this; }
  getIsTrashed() { return this.isTrashed; }
  setIsTrashed(isTrashed: boolean | null) { this.isTrashed = isTrashed; return this; }
  getSanitizedName() { return this.sanitizedName; }
  setSanitizedName(sanitizedName: string | null) { this.sanitizedName = sanitizedName; return this; }
  getSourceId() { return this.sourceId; }
  setSourceId(sourceId: number | null) { this.sourceId = sourceId; return this; }
  getDownloadLink() { return this.downloadLink; }
  setDownloadLink(downloadLink: string | null) { this.downloadLink = downloadLink; return this; }
  getDownloadVersionLink() { return this.downloadVersionLink; }
  setDownloadVersionLink(downloadVersionLink: string | null) { this.downloadVersionLink = downloadVersionLink; return this; }
  getFileType() { return this.type; }
  setType(type: string | null) { this.type = type; return this; }
  getPreviews() { return this.previews; }
  setPreviews(previews: Record<string, unknown>[] | null) { this.previews = previews; return this; }
  getRequestId() { return this.requestId; }
  setRequestId(id: string | null) { this.requestId = id; return this; }

  static getAvailableWith(): string[] {
    return [FileModel.DELETED, FileModel.UNBILLED];
  }

  fromArray(data: Record<string, unknown>): this {
    if (!data['id'] || !data['uuid']) {
      throw new InvalidArgumentException('File id/uuid is empty in ' + JSON.stringify(data));
    }
    this.setId(Number(data['id']));
    this.setUuid(String(data['uuid']));
    if (data['version_uuid']) this.setVersionUuid(String(data['version_uuid']));
    if (data['name']) this.setName(String(data['name']));
    if (data['size'] !== undefined) this.setSize(Number(data['size']));

    const links = data['_links'] as Record<string, unknown> | undefined;
    if (links) {
      const download = links['download'] as Record<string, unknown> | undefined;
      if (download) this.setDownloadLink(String(download['href']));
      const downloadVersion = links['download_version'] as Record<string, unknown> | undefined;
      if (downloadVersion) this.setDownloadVersionLink(String(downloadVersion['href']));
    }

    if (data['created_at'] !== undefined) this.setCreatedAt(Number(data['created_at']));
    const createdByObj = data['created_by'] as Record<string, unknown> | undefined;
    if (createdByObj && typeof createdByObj === 'object') {
      this.setCreatedBy(Number(createdByObj['id']));
      this.setCreatedByType(String(createdByObj['type']));
    }

    if (data['updated_at'] !== undefined) this.setUpdatedAt(Number(data['updated_at']));
    const updatedByObj = data['updated_by'] as Record<string, unknown> | undefined;
    if (updatedByObj && typeof updatedByObj === 'object') {
      this.setUpdatedBy(Number(updatedByObj['id']));
      this.setUpdatedByType(String(updatedByObj['type']));
    }

    if (data['deleted_at'] !== undefined) this.setDeletedAt(data['deleted_at'] as number | null);
    const deletedByObj = data['deleted_by'] as Record<string, unknown> | undefined;
    if (deletedByObj && typeof deletedByObj === 'object' && (deletedByObj['id'] || deletedByObj['type'])) {
      this.setDeletedBy(Number(deletedByObj['id']));
      this.setDeletedByType(String(deletedByObj['type']));
    }

    if (data['has_multiple_versions'] !== undefined) this.setHasMultipleVersions(Boolean(data['has_multiple_versions']));
    if (data['is_trashed'] !== undefined) this.setIsTrashed(Boolean(data['is_trashed']));

    const metadata = data['metadata'] as Record<string, unknown> | undefined;
    if (metadata) {
      if (metadata['extension']) this.setExtension(String(metadata['extension']));
      if (metadata['mime_type']) this.setMimeType(String(metadata['mime_type']));
    }

    if (data['sanitized_name']) this.setSanitizedName(String(data['sanitized_name']));
    if (data['source_id'] !== undefined) this.setSourceId(data['source_id'] as number | null);
    if (data['previews']) this.setPreviews(data['previews'] as Record<string, unknown>[]);
    if (data['type']) this.setType(String(data['type']));

    return this as this;
  }

  toArray(): Record<string, unknown> {
    return {
      id: this.id,
      uuid: this.uuid,
      version_uuid: this.versionUuid,
      name: this.name,
      size: this.size,
      download_link: this.downloadLink,
      download_version_link: this.downloadVersionLink,
      created_at: this.createdAt,
      created_by: { id: this.createdBy, type: this.createdByType },
      updated_at: this.updatedAt,
      updated_by: { id: this.updatedBy, type: this.updatedByType },
      deleted_at: this.deletedAt,
      deleted_by: (!this.deletedBy && !this.deletedByType) ? null : { id: this.deletedBy, type: this.deletedByType },
      has_multiple_version: this.hasMultipleVersions,
      is_trashed: this.isTrashed,
      extension: this.extension,
      previews: this.previews,
      mime_type: this.mimeType,
      sanitized_name: this.sanitizedName,
      source_id: this.sourceId,
      type: this.type,
    };
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    result['uuid'] = this.uuid;

    if (this.nameChanged && this.name !== null) result['name'] = this.name;
    if (this.versionUuidChanged && this.versionUuid !== null) result['version_uuid'] = this.versionUuid;
    if (this.updatedByChanged && this.updatedBy !== null && this.updatedByType !== null) {
      result['updated_by'] = { id: this.updatedBy, type: this.updatedByType };
    }
    if (this.createdByChanged && this.createdBy !== null && this.createdByType !== null) {
      result['created_by'] = { id: this.createdBy, type: this.createdByType };
    }

    if (this.requestId === null && requestId !== null && requestId !== undefined) {
      this.requestId = String(requestId);
    }

    result['request_id'] = this.requestId;

    this.createdByChanged = false;
    this.updatedByChanged = false;
    this.versionUuidChanged = false;
    this.nameChanged = false;

    return result;
  }

  toDeleteApi(): Record<string, unknown> {
    return { uuid: this.uuid };
  }
}
