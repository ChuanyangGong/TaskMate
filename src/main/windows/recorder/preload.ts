import { ipcRenderer } from 'electron';

export default {
  invokeFocusOrBlur: (callback: any) => ipcRenderer.on('recoder:invokeFocusOrBlur', callback),
  clearInvokeFocusOrBlur: () => ipcRenderer.removeAllListeners('recoder:invokeFocusOrBlur'),
  invokeAccelerator: (callback: any) => ipcRenderer.on('recoder:invokeAccelerator', callback),
  clearInvokeAccelerator: () => ipcRenderer.removeAllListeners('recoder:invokeAccelerator'),
  setRecorderStatus: (callback: any) => ipcRenderer.on('recoder:setRecorderStatus', callback),
  clearSetRecorderStatus: () => ipcRenderer.removeAllListeners('recoder:setRecorderStatus'),
  handleRecorderFinish: (timeSlice: [Date, Date | null][]) => ipcRenderer.send('recoder:handleRecorderFinish', timeSlice),
  invokeContinueTask: (callback: any) => ipcRenderer.on('recoder:invokeContinueTask', callback),
  clearInvokeContinueTask: () => ipcRenderer.removeAllListeners('recoder:invokeContinueTask'),
};
