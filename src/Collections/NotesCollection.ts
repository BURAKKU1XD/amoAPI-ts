import { BaseApiCollection } from './BaseApiCollection';
import { NoteModel } from '../Models/NoteModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class NotesCollection extends BaseApiCollection<NoteModel> {
  protected getItemClass(): ModelConstructor<NoteModel> {
    return NoteModel;
  }
}
