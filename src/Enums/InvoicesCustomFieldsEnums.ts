/**
 * Invoice custom field codes
 */
export const InvoicesCustomFields = {
  /** Bill status field */
  STATUS: 'BILL_STATUS',
  /** Legal entity field */
  LEGAL_ENTITY: 'LEGAL_ENTITY',
  /** Supplier field */
  SUPPLIER: 'SUPPLIER',
  /** Payer field */
  PAYER: 'PAYER',
  /** Invoice items field */
  ITEMS: 'ITEMS',
  /** VAT type field */
  VAT_TYPE: 'BILL_VAT_TYPE',
  /** Reason for no VAT field */
  REASON_FOR_NO_VAT: 'BILL_REASON_FOR_NO_VAT',
  /** Payment date field */
  PAYMENT_DATE: 'BILL_PAYMENT_DATE',
  /** Comment field */
  COMMENT: 'BILL_COMMENT',
  /** Total price field */
  PRICE: 'BILL_PRICE',
} as const;

/**
 * VAT type values
 */
export enum VatTypeEnum {
  /** VAT exempt */
  EXEMPT = 'vat_exempt',
  /** VAT included in price */
  INCLUDED = 'vat_included',
  /** VAT not included in price */
  NOT_INCLUDED = 'vat_not_included',
}

/**
 * Bill status codes
 */
export enum BillStatusEnum {
  /** Created */
  CREATED = 'created',
  /** Paid */
  PAID = 'paid',
  /** Paid in advance */
  PAID_IN_ADVANCE = 'paid_in_advance',
  /** Partially paid */
  PARTIALLY_PAID = 'partially_paid',
}
