import { BaseApiCollection } from './BaseApiCollection';
import { TaskModel } from '../Models/TaskModel';
import { ModelConstructor } from '../Models/BaseApiModel';

export class TasksCollection extends BaseApiCollection<TaskModel> {
  protected getItemClass(): ModelConstructor<TaskModel> {
    return TaskModel;
  }
}
