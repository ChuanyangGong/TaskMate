import { app, BrowserWindow, Menu, MenuItem, screen } from 'electron';
import path from 'path';
import { resolveHtmlPath } from '../../util';
import { getConfigManager } from '../../config/ConfigManager';
import { debounce } from '../../../renderer/utils';

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

  recorderWindow.on('focus', () => {
    recorderWindow?.setIgnoreMouseEvents(false);
    recorderWindow?.webContents.send('recoder:invokeFocusOrBlur', 'focus');
  });

  recorderWindow.on('blur', () => {
    recorderWindow?.setIgnoreMouseEvents(true);
    recorderWindow?.webContents.send('recoder:invokeFocusOrBlur', 'blur')
  });

  // 创建快捷键
  const cfgManager = getConfigManager();
  const { userConfig } = cfgManager.config || {};
  const { shortcuts } = userConfig || {};
  const { startPauseRecorder, stopRecorder } = shortcuts || {};

  const debounceAccelerator = debounce((action: string) => {
    recorderWindow?.webContents.send('recoder:invokeAccelerator', action);
  }, 100, true);

  const menu = new Menu();
  menu.append(new MenuItem({
    label: '操作',
    submenu: [{
      label: '开始/暂停',
      accelerator: startPauseRecorder,
      click: () => debounceAccelerator('startOrPause')
    },
    {
      label: '结束',
      accelerator: stopRecorder,
      click: () => debounceAccelerator('stop')
    }],
  }))
  Menu.setApplicationMenu(menu)
};

export const getRecorderWindow = () => {
  return recorderWindow;
};
