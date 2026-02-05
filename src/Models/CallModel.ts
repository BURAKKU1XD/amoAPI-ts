import { BaseApiModel } from './BaseApiModel';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';

export class CallModel extends BaseApiModel {
  static readonly CALL_DIRECTION_IN = 'inbound';
  static readonly CALL_DIRECTION_OUT = 'outbound';
  static readonly CALL_STATUS_LEAVE_MESSAGE = 1;
  static readonly CALL_STATUS_CALL_BACK_LATER = 2;
  static readonly CALL_STATUS_ABSENT = 3;
  static readonly CALL_STATUS_CONNECTED = 4;
  static readonly CALL_STATUS_NOT_CONNECTED = 5;
  static readonly CALL_STATUS_WRONG_NUMBER = 6;
  static readonly CALL_STATUS_VOICEMAIL = 7;

  protected uniq: string | null = null;
  protected duration: number | null = null;
  protected source: string | null = null;
  protected link: string | null = null;
  protected phone: string | null = null;
  protected callResult: string | null = null;
  protected callStatus: number | null = null;
  protected responsibleUserId: number | null = null;
  protected createdBy: number | null = null;
  protected updatedBy: number | null = null;
  protected createdAt: number | null = null;
  protected updatedAt: number | null = null;
  protected direction: string | null = null;
  protected requestId: string | null = null;

  getUniq() { return this.uniq; }
  setUniq(u: string | null) { this.uniq = u; return this; }
  getDuration() { return this.duration; }
  setDuration(d: number | null) { this.duration = d; return this; }
  getSource() { return this.source; }
  setSource(s: string | null) { this.source = s; return this; }
  getLink() { return this.link; }
  setLink(l: string | null) { this.link = l; return this; }
  getPhone() { return this.phone; }
  setPhone(p: string | null) { this.phone = p; return this; }
  getCallResult() { return this.callResult; }
  setCallResult(r: string | null) { this.callResult = r; return this; }
  getCallStatus() { return this.callStatus; }
  setCallStatus(s: number | null) { this.callStatus = s; return this; }
  getResponsibleUserId() { return this.responsibleUserId; }
  setResponsibleUserId(id: number | null) { this.responsibleUserId = id; return this; }
  getCreatedBy() { return this.createdBy; }
  setCreatedBy(id: number | null) { this.createdBy = id; return this; }
  getUpdatedBy() { return this.updatedBy; }
  setUpdatedBy(id: number | null) { this.updatedBy = id; return this; }
  getCreatedAt() { return this.createdAt; }
  setCreatedAt(ts: number | null) { this.createdAt = ts; return this; }
  getUpdatedAt() { return this.updatedAt; }
  setUpdatedAt(ts: number | null) { this.updatedAt = ts; return this; }
  getDirection() { return this.direction; }
  setDirection(d: string | null) { this.direction = d; return this; }
  getRequestId() { return this.requestId; }
  setRequestId(id: string | null) { this.requestId = id; return this; }

  fromArray(data: Record<string, unknown>): this {
    if (data['uniq'] !== undefined && data['uniq'] !== null) this.setUniq(String(data['uniq']));
    if (data['duration'] !== undefined && data['duration'] !== null) this.setDuration(Number(data['duration']));
    if (data['source'] !== undefined && data['source'] !== null) this.setSource(String(data['source']));
    if (data['link'] !== undefined && data['link'] !== null) this.setLink(String(data['link']));
    if (data['phone'] !== undefined && data['phone'] !== null) this.setPhone(String(data['phone']));
    if (data['call_result'] !== undefined && data['call_result'] !== null) this.setCallResult(String(data['call_result']));
    if (data['call_status'] !== undefined && data['call_status'] !== null) this.setCallStatus(Number(data['call_status']));
    if (data['responsible_user_id'] !== undefined && data['responsible_user_id'] !== null) this.setResponsibleUserId(Number(data['responsible_user_id']));
    if (data['created_by'] !== undefined && data['created_by'] !== null) this.setCreatedBy(Number(data['created_by']));
    if (data['updated_by'] !== undefined && data['updated_by'] !== null) this.setUpdatedBy(Number(data['updated_by']));
    if (data['created_at']) this.setCreatedAt(Number(data['created_at']));
    if (data['updated_at']) this.setUpdatedAt(Number(data['updated_at']));
    if (data['direction'] !== undefined && data['direction'] !== null) this.setDirection(String(data['direction']));
    return this as this;
  }

  toArray(): Record<string, unknown> {
    return {
      uniq: this.uniq, duration: this.duration,
      source: this.source, link: this.link,
      phone: this.phone, call_result: this.callResult,
      call_status: this.callStatus,
      responsible_user_id: this.responsibleUserId,
      created_by: this.createdBy, updated_by: this.updatedBy,
      created_at: this.createdAt, updated_at: this.updatedAt,
      direction: this.direction,
    };
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    if (this.uniq !== null) result['uniq'] = this.uniq;
    if (this.duration !== null) result['duration'] = this.duration;
    if (this.source !== null) result['source'] = this.source;
    if (this.link !== null) result['link'] = this.link;
    if (this.phone !== null) result['phone'] = this.phone;
    if (this.callResult !== null) result['call_result'] = this.callResult;
    if (this.callStatus !== null) result['call_status'] = this.callStatus;
    if (this.responsibleUserId !== null) result['responsible_user_id'] = this.responsibleUserId;
    if (this.createdBy !== null) result['created_by'] = this.createdBy;
    if (this.updatedBy !== null) result['updated_by'] = this.updatedBy;
    if (this.createdAt !== null) result['created_at'] = this.createdAt;
    if (this.direction !== null) result['direction'] = this.direction;
    if (this.requestId === null && requestId !== null && requestId !== undefined) this.requestId = String(requestId);
    if (this.requestId !== null) result['request_id'] = this.requestId;
    return result;
  }
}
