import { app, BrowserWindow, ipcMain, screen } from 'electron';
import path from 'path';
import { resolveHtmlPath } from '../../util';
import { setFocusStatus } from '../../focusBlurManager';
import { getRecorderWindow } from '../recorder';

export const miniEditorWidth = 280;
export const miniEditorHeight = 360;

let miniEditorWindow: BrowserWindow | null = null;
export const createMiniEditorWindow = async () => {
  // 检查时候存在 miniEditorWindow 窗口
  if (miniEditorWindow !== null) {
    miniEditorWindow.restore();
    miniEditorWindow.focus();
    return;
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  let priScreenInfo = screen.getPrimaryDisplay()
  let screenWidth = priScreenInfo.size.width;

  miniEditorWindow = new BrowserWindow({
    show: false,
    width: miniEditorWidth,
    height: miniEditorHeight,
    x: screenWidth - miniEditorWidth - 30,
    y: 134,
    resizable: false,
    icon: getAssetPath('icon.png'),
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../../../.erb/dll/preload.js'),
    },
  });

  miniEditorWindow.loadURL(resolveHtmlPath('miniEditor.html'));

  miniEditorWindow.on('ready-to-show', () => {
    if (!miniEditorWindow) {
      throw new Error('"miniEditorWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      miniEditorWindow.minimize();
    } else {
      miniEditorWindow.show();
    }
  });

  miniEditorWindow.on('closed', () => {
    miniEditorWindow = null;
  });

  miniEditorWindow.on('blur', () => {
    setFocusStatus('miniEditor', 'blur');
  });

  miniEditorWindow.on('focus', () => {
    setFocusStatus('miniEditor', 'focus');
  });
};

ipcMain.on('miniEditor:setRecorderTimeSlice', async (_, timeSlice: [Date, Date][]) => {
  const recorderWindow = getRecorderWindow();
  if (recorderWindow) {
    recorderWindow.webContents.send('recoder:setRecorderStatus', timeSlice);
  }
});

export const getMiniEditorWindow = () => {
  return miniEditorWindow;
};
