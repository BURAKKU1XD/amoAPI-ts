/**
 * Note types enum
 */
export enum NoteTypesEnum {
  /** Common note */
  COMMON = 'common',
  /** Call in */
  CALL_IN = 'call_in',
  /** Call out */
  CALL_OUT = 'call_out',
  /** Service message */
  SERVICE_MESSAGE = 'service_message',
  /** Message cashier */
  MESSAGE_CASHIER = 'message_cashier',
  /** Invoice paid */
  INVOICE_PAID = 'invoice_paid',
  /** AMOMAIL message */
  AMOMAIL_MESSAGE = 'amomail_message',
  /** SMS in */
  SMS_IN = 'sms_in',
  /** SMS out */
  SMS_OUT = 'sms_out',
  /** Extended service message */
  EXTENDED_SERVICE_MESSAGE = 'extended_service_message',
  /** Attachment */
  ATTACHMENT = 'attachment',
  /** Geolocation */
  GEOLOCATION = 'geolocation',
  /** Max next date */
  MAX_NEXT_DATE = 'max_next_date',
  /** Lead status changed */
  LEAD_STATUS_CHANGED = 'lead_status_changed',
  /** Transaction */
  TRANSACTION = 'transaction',
  /** Customer status changed */
  CUSTOMER_STATUS_CHANGED = 'customer_status_changed',
  /** AI message */
  AI_MESSAGE = 'ai_message',
}

/**
 * Get all note types
 */
export function getAllNoteTypes(): NoteTypesEnum[] {
  return Object.values(NoteTypesEnum);
}
