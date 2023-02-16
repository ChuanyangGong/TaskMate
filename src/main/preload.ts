import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import dashboardPreloader from './windows/dashboard/preload';
import commonPreloader from './windows/common/preload';

const electronHandler = {
  dashboard: dashboardPreloader,
  common: commonPreloader,
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
