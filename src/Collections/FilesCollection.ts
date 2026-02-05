import { BaseApiCollection } from './BaseApiCollection';
import { FileModel } from '../Models/FileModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class FilesCollection extends BaseApiCollection<FileModel> {
  protected getItemClass(): ModelConstructor<FileModel> {
    return FileModel;
  }
}
