import { ipcRenderer } from 'electron';

export default {
  invokeFocusOrBlur: (callback: any) => ipcRenderer.on('recoder:invokeFocusOrBlur', callback),
  clearInvokeFocusOrBlur: () => ipcRenderer.removeAllListeners('recoder:invokeFocusOrBlur'),
};
