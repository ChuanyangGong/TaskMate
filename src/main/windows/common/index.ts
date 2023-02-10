import { BrowserWindow, ipcMain } from 'electron';

export default async function initialCommonHandler() {
  ipcMain.on('window:close', (event) => {
    const webContents = event.sender;
    const miniWindow = BrowserWindow.fromWebContents(webContents);
    miniWindow?.close();
  });

  ipcMain.on('window:minimize', (event) => {
    const webContents = event.sender;
    const miniWindow = BrowserWindow.fromWebContents(webContents);
    miniWindow?.minimize();
  });

  ipcMain.handle('window:revertWindowSize', (event, wantMaximum) => {
    const webContents = event.sender;
    const miniWindow = BrowserWindow.fromWebContents(webContents);
    if (wantMaximum) {
      miniWindow?.maximize();
    } else {
      miniWindow?.unmaximize();
    }
    return wantMaximum;
  });
}
