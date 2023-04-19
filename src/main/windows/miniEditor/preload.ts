import { ipcRenderer } from 'electron';

export default {
  invokeFocusOrBlur: (callback: any) => ipcRenderer.on('miniEditor:invokeFocusOrBlur', callback),
  clearInvokeFocusOrBlur: () => ipcRenderer.removeAllListeners('miniEditor:invokeFocusOrBlur'),
  invokeAccelerator: (callback: any) => ipcRenderer.on('miniEditor:invokeAccelerator', callback),
  clearInvokeAccelerator: () => ipcRenderer.removeAllListeners('miniEditor:invokeAccelerator'),
};
