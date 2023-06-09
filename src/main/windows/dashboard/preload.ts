import { ipcRenderer } from 'electron';
import { FilterParamType, TaskDetailItemType } from 'typings/renderer/dashboard/App';
import { FilterItemFormDataType } from 'typings/renderer/dashboard/components/TaskMenu';

export default {
  getFilterListChildren: () => ipcRenderer.invoke('dashboard:getFilterListChildren'),
  getItemDetailByType: (type: string, id: number) => ipcRenderer.invoke('dashboard:getItemDetailByType', type, id),
  saveOrNewItemByType: (type: string, data: FilterItemFormDataType) => ipcRenderer.invoke('dashboard:saveOrNewItemByType', type, data),
  deleteCategoryOrTagItemByType: (type: string, id: number) => ipcRenderer.invoke('dashboard:deleteCategoryOrTagItemByType', type, id),
  getTaskListData: (filterParam: FilterParamType) => ipcRenderer.invoke('dashboard:getTaskListData', filterParam),
  getTaskDetailById: (id: number) => ipcRenderer.invoke('dashboard:getTaskDetailById', id),
  updateOrCreateTask: (recordItem: TaskDetailItemType) => ipcRenderer.invoke('dashboard:updateOrCreateTask', recordItem),
  invokeRefreshTaskList: (callback: any) => ipcRenderer.on('dashboard:invokeRefreshTaskList', callback),
  clearInvokeRefreshTaskList: () => ipcRenderer.removeAllListeners('dashboard:invokeRefreshTaskList'),
  deleteTaskById: (id: number) => ipcRenderer.invoke('dashboard:deleteTaskById', id),
  getCategoryDetail: (categoryId: number | null) => ipcRenderer.invoke('dashboard:getCategoryDetail', categoryId),
  setContinueTask: (taskId: number) => ipcRenderer.invoke('dashboard:setContinueTask', taskId),
  handleSendMessage: (message: string, type: string) => ipcRenderer.invoke('dashboard:handleSendMessage', message, type),
  invokeSendMessage: (callback: any) => ipcRenderer.on('dashboard:invokeSendMessage', callback),
  clearInvokeSendMessage: () => ipcRenderer.removeAllListeners('dashboard:invokeSendMessage'),
};
