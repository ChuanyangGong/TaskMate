import { app, BrowserWindow } from 'electron';
import path from 'path';
import { resolveHtmlPath } from '../../util';

let recorderWindow: BrowserWindow | null = null;
export const createRecorderWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  recorderWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../../../.erb/dll/preload.js'),
    },
  });

  recorderWindow.loadURL(resolveHtmlPath('recorder.html'));

  recorderWindow.on('ready-to-show', () => {
    if (!recorderWindow) {
      throw new Error('"recorderWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      recorderWindow.minimize();
    } else {
      recorderWindow.show();
    }
  });

  recorderWindow.on('closed', () => {
    recorderWindow = null;
  });
};

export const getRecorderWindow = () => {
  return recorderWindow;
};
