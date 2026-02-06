import { BaseApiModel } from './BaseApiModel';

/**
 * Source model
 */
export class SourceModel extends BaseApiModel {
  protected id: number | null = null;
  protected name: string | null = null;
  protected originCode: string | null = null;
  protected default: boolean | null = false;
  protected services: Record<string, unknown>[] | null = null;
  protected externalId: string | null = null;
  protected pipelineId: number | null = null;
  protected requestId: string | null = null;

  getId() { return this.id; }
  setId(id: number | null) { this.id = id; return this; }
  getName() { return this.name; }
  setName(name: string) { this.name = name; return this; }
  getOriginCode() { return this.originCode; }
  setOriginCode(originCode: string | null) { this.originCode = originCode; return this; }
  isDefault() { return Boolean(this.default); }
  getDefault() { return this.default; }
  setDefault(value: boolean | null) { this.default = value; return this; }
  getServices() { return this.services; }
  setServices(services: Record<string, unknown>[] | null) { this.services = services; return this; }
  getExternalId() { return this.externalId; }
  setExternalId(externalId: string) { this.externalId = externalId; return this; }
  getPipelineId() { return this.pipelineId; }
  setPipelineId(pipelineId: number | null) { this.pipelineId = pipelineId; return this; }
  getRequestId() { return this.requestId; }
  setRequestId(id: string | null) { this.requestId = id; return this; }

  fromArray(data: Record<string, unknown>): this {
    this.setId(data['id'] !== undefined ? Number(data['id']) : null);
    if (data['name']) this.setName(String(data['name']));
    if (data['default'] !== undefined) this.setDefault(Boolean(data['default']));
    if (data['services']) this.setServices(data['services'] as Record<string, unknown>[]);
    if (data['external_id']) this.setExternalId(String(data['external_id']));
    if (data['origin_code'] !== undefined) this.setOriginCode(data['origin_code'] as string | null);
    if (data['pipeline_id'] !== undefined) this.setPipelineId(data['pipeline_id'] !== null ? Number(data['pipeline_id']) : null);

    return this as this;
  }

  toArray(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      default: this.isDefault(),
      external_id: this.externalId,
      origin_code: this.originCode,
      pipeline_id: this.pipelineId,
      services: this.services,
    };
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    if (this.name !== null) result['name'] = this.name;
    if (this.id !== null) result['id'] = this.id;
    if (this.externalId !== null) result['external_id'] = this.externalId;
    if (this.originCode !== null) result['origin_code'] = this.originCode;
    if (this.pipelineId !== null) result['pipeline_id'] = this.pipelineId;
    if (this.default !== null) result['default'] = this.isDefault();
    if (this.services !== null) result['services'] = this.services;

    if (this.requestId === null && requestId !== null && requestId !== undefined) {
      this.requestId = String(requestId);
    }

    result['request_id'] = this.requestId;

    return result;
  }
}
