/**
 * Call status and direction constants
 */
export enum CallStatus {
  LEAVE_MESSAGE = 1,
  SUCCESS_RECALL = 2,
  SUCCESS_NOT_IN_STOCK = 3,
  SUCCESS_CONVERSATION = 4,
  FAIL_WRONG_NUMBER = 5,
  FAIL_NOT_PHONED = 6,
  FAIL_BUSY = 7,
  UNDEFINED = 8,
}

export enum CallDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
}

export const AVAILABLE_CALL_STATUSES = [
  CallStatus.LEAVE_MESSAGE,
  CallStatus.SUCCESS_RECALL,
  CallStatus.SUCCESS_NOT_IN_STOCK,
  CallStatus.SUCCESS_CONVERSATION,
  CallStatus.FAIL_WRONG_NUMBER,
  CallStatus.FAIL_NOT_PHONED,
  CallStatus.FAIL_BUSY,
  CallStatus.UNDEFINED,
];

/**
 * Interface for entities that support call tracking
 */
export interface CallInterface {
  getUniq(): string | null;
  setUniq(uniq: string): this;
  getDuration(): number | null;
  setDuration(duration: number): this;
  getSource(): string | null;
  setSource(source: string): this;
  getLink(): string | null;
  setLink(link: string): this;
  getPhone(): string | null;
  setPhone(phone: string): this;
  getCallResult(): string | null;
  setCallResult(callResult: string): this;
  getCallStatus(): CallStatus | null;
  setCallStatus(callStatus: CallStatus): this;
  getDirection(): CallDirection | null;
  setDirection(direction: CallDirection): this;
}
