import { apiClient, getToken, saveToken, printError } from './bootstrap';
import {
    AccessTokenInterface,
    EntityTypes,
    TasksCollection,
    AmoCRMApiException,
    TaskModel,
    TasksFilter,
} from 'amocrm-api-library';

const { accessToken, baseDomain } = getToken();

apiClient.setAccessToken(accessToken)
    .setAccountBaseDomain(baseDomain)
    .onAccessTokenRefresh(async (accessToken: AccessTokenInterface, baseDomain: string) => {
        saveToken({
            accessToken: accessToken.getToken(),
            refreshToken: accessToken.getRefreshToken()!,
            expires: accessToken.getExpires()!,
            baseDomain,
        });
    });

//Создадим задачу
let tasksCollection = new TasksCollection();
const task = new TaskModel();
task.setTaskTypeId(TaskModel.TASK_TYPE_ID_CALL)
    .setText('Новая задач')
    .setCompleteTill(Math.floor(new Date(2020, 9, 3, 10, 0, 0).getTime() / 1000))
    .setEntityType(EntityTypes.LEADS)
    .setEntityId(1)
    .setDuration(30 * 60) //30 минут
    .setResponsibleUserId(123);
tasksCollection.add(task);

const tasksService = apiClient.tasks();
try {
    tasksCollection = await tasksService.add(tasksCollection);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}

//Закроем задачу, что только создали (не делайте так в продакшене)
let taskToClose = tasksCollection.first()!;
taskToClose.setIsCompleted(true)
    .setResult({ text: 'Выполнено' });

try {
    //Получим актуальное состояние задачи и обновим её
    taskToClose = await tasksService.syncOne(taskToClose);
    taskToClose = await tasksService.updateOne(taskToClose);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}
console.log(taskToClose.toArray());


//Получим задачи с фильтром по типу
const tasksFilter = new TasksFilter();
tasksFilter.setTaskTypeId(TaskModel.TASK_TYPE_ID_MEETING);
try {
    tasksCollection = await tasksService.get(tasksFilter);
} catch (e: any) {
    if (e instanceof AmoCRMApiException) {
        printError(e);
        process.exit(1);
    }
}
console.log(tasksCollection.toArray());
