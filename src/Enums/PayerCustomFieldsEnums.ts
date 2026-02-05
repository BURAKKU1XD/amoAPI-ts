/**
 * Payer types enum
 */
export enum PayerTypeEnum {
  /** Legal entity */
  LEGAL = 'legal',
  /** Individual */
  INDIVIDUAL = 'individual',
}

/**
 * Check if payer type is valid
 */
export function isValidPayerType(type: string): type is PayerTypeEnum {
  return Object.values(PayerTypeEnum).includes(type as PayerTypeEnum);
}
