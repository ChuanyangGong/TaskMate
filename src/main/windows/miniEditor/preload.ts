import { ipcRenderer } from 'electron';

export default {
  invokeFocusOrBlur: (callback: any) => ipcRenderer.on('miniEditor:invokeFocusOrBlur', callback),
  clearInvokeFocusOrBlur: () => ipcRenderer.removeAllListeners('miniEditor:invokeFocusOrBlur'),
  invokeAccelerator: (callback: any) => ipcRenderer.on('miniEditor:invokeAccelerator', callback),
  clearInvokeAccelerator: () => ipcRenderer.removeAllListeners('miniEditor:invokeAccelerator'),
  invokeFinishRecord: (callback: any) => ipcRenderer.on('miniEditor:invokeFinishRecord', callback),
  clearInvokeFinishRecord: () => ipcRenderer.removeAllListeners('miniEditor:invokeFinishRecord'),
  setRecorderTimeSlice: (timeSlice: [Date, Date | null][]) => ipcRenderer.send('miniEditor:setRecorderTimeSlice', timeSlice),
  invokeSetTaskInfo: (taskInfo: any) => ipcRenderer.send('miniEditor:invokeSetTaskInfo', taskInfo),
  setTaskInfo: (callback: any) => ipcRenderer.on('miniEditor:setTaskInfo', callback),
  clearSetTaskInfo: () => ipcRenderer.removeAllListeners('miniEditor:setTaskInfo'),
};
