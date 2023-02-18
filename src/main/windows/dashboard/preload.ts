import { ipcRenderer } from 'electron';
import { FilterItemFormDataType } from 'typings/renderer/dashboard/components/TaskMenu';

export default {
  getCategoryList: () => ipcRenderer.invoke('dashboard:getCategoryList'),
  getItemDetailByType: (type: string, id: number) => ipcRenderer.invoke('dashboard:getItemDetailByType', type, id),
  saveOrNewItemByType: (type: string, data: FilterItemFormDataType) => ipcRenderer.invoke('dashboard:saveOrNewItemByType', type, data),
};
