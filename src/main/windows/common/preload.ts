import { ipcRenderer } from 'electron';

export default {
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  closeWindow: () => ipcRenderer.send('window:close'),
  revertWindowSize: (args: boolean) =>
    ipcRenderer.invoke('window:revertWindowSize', args),
};
