import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import dashboardPreloader from './windows/dashboard/preload';
import commonPreloader from './windows/common/preload';
import recorderPreloader from './windows/recorder/preload';
import miniEditorPreloader from './windows/miniEditor/preload';

const electronHandler = {
  dashboard: dashboardPreloader,
  recorder: recorderPreloader,
  common: commonPreloader,
  miniEditor: miniEditorPreloader,
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
