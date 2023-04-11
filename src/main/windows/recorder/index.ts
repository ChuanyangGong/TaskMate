import { app, BrowserWindow, screen } from 'electron';
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

  let priScreenInfo = screen.getPrimaryDisplay()
  let screenWidth = priScreenInfo.size.width;
  let recorderWidth = 170;
  let recorderHeight = 54;

  recorderWindow = new BrowserWindow({
    show: false,
    width: recorderWidth,
    height: recorderHeight,
    x: screenWidth - recorderWidth - 140,
    y: 70,
    resizable: false,
    icon: getAssetPath('icon.png'),
    transparent: true,
    frame: false,
    alwaysOnTop: true,
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
