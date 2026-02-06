/**
 * Call status enum
 */
export enum CallStatusEnum {
  LEAVE_MESSAGE = 1,
  SUCCESS_RECALL = 2,
  SUCCESS_NOT_IN_STOCK = 3,
  SUCCESS_CONVERSATION = 4,
  FAIL_WRONG_NUMBER = 5,
  FAIL_NOT_PHONED = 6,
  FAIL_BUSY = 7,
  UNDEFINED = 8,
}

/**
 * Call direction enum
 */
export enum CallDirectionEnum {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
}

/**
 * Available call statuses
 */
export const AVAILABLE_CALL_STATUSES = [
  CallStatusEnum.LEAVE_MESSAGE,
  CallStatusEnum.SUCCESS_RECALL,
  CallStatusEnum.SUCCESS_NOT_IN_STOCK,
  CallStatusEnum.SUCCESS_CONVERSATION,
  CallStatusEnum.FAIL_WRONG_NUMBER,
  CallStatusEnum.FAIL_NOT_PHONED,
  CallStatusEnum.FAIL_BUSY,
  CallStatusEnum.UNDEFINED,
] as const;
