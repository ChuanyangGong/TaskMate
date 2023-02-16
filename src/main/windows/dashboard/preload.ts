import { ipcRenderer } from 'electron';

export default {
  getCategoryList: () => ipcRenderer.invoke('dashboard:getCategoryList'),
};
