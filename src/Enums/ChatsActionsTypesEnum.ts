/**
 * Chat template attachment types
 */
export enum ChatTemplateAttachmentTypesEnum {
  PICTURE = 'picture',
  FILE = 'file',
  DOCUMENT = 'document',
  VIDEO = 'video',
}

/**
 * Get all attachment types
 */
export function getAllAttachmentTypes(): ChatTemplateAttachmentTypesEnum[] {
  return [
    ChatTemplateAttachmentTypesEnum.PICTURE,
    ChatTemplateAttachmentTypesEnum.FILE,
    ChatTemplateAttachmentTypesEnum.DOCUMENT,
    ChatTemplateAttachmentTypesEnum.VIDEO,
  ];
}

/**
 * Chat template button types
 */
export enum ChatTemplateButtonTypesEnum {
  TEXT = 'inline',
  URL = 'url',
}

/**
 * Get all button types
 */
export function getAllButtonTypes(): ChatTemplateButtonTypesEnum[] {
  return [
    ChatTemplateButtonTypesEnum.TEXT,
    ChatTemplateButtonTypesEnum.URL,
  ];
}
