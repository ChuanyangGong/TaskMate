import { ipcRenderer } from 'electron';
import { FilterParamType } from 'typings/renderer/dashboard/App';
import { FilterItemFormDataType } from 'typings/renderer/dashboard/components/TaskMenu';

export default {
  getFilterListChildren: () => ipcRenderer.invoke('dashboard:getFilterListChildren'),
  getItemDetailByType: (type: string, id: number) => ipcRenderer.invoke('dashboard:getItemDetailByType', type, id),
  saveOrNewItemByType: (type: string, data: FilterItemFormDataType) => ipcRenderer.invoke('dashboard:saveOrNewItemByType', type, data),
  deleteCategoryOrTagItemByType: (type: string, id: number) => ipcRenderer.invoke('dashboard:deleteCategoryOrTagItemByType', type, id),
  getTaskListData: (filterParam: FilterParamType) => ipcRenderer.invoke('dashboard:getTaskListData', filterParam),
};
