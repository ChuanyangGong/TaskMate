import { BrowserWindow, Menu, Tray, globalShortcut, ipcMain, nativeImage } from 'electron';
import { getConfigManager } from '../../config/ConfigManager';
import { createRecorderWindow, getRecorderWindow } from '../recorder';
import { createMiniEditorWindow, getMiniEditorWindow } from '../miniEditor';
import { isFocus, setFocusStatus } from '../../focusBlurManager';
import { createDashboardWindow } from '../dashboard';
import path from 'path';

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

  const cfgManager = getConfigManager();
  const { userConfig } = cfgManager.config || {};
  const { shortcuts } = userConfig || {};
  const { activateRecorder, minimizeRecorder } = shortcuts || {};

  // 注册全局快捷键 —— 激活、不激活
  globalShortcut.register(activateRecorder || 'Alt+X', () => {
    let recorderWin = getRecorderWindow();
    let miniEditorWin = getMiniEditorWindow();
    if (recorderWin === null || miniEditorWin === null) {
      recorderWin === null && createRecorderWindow();
      miniEditorWin === null && createMiniEditorWindow();
      return;
    }

    // 如果窗口最小化，则恢复
    if (recorderWin.isMinimized()) {
      recorderWin.restore();
      miniEditorWin.restore();
    } else if (isFocus()) {
      setFocusStatus('miniEditor', 'blur');
      setFocusStatus('recorder', 'blur');
    } else {
      recorderWin.focus();
      miniEditorWin.focus();
    }
  });

  // 注册全局快捷键 —— 最小化、不最小化
  globalShortcut.register(minimizeRecorder || 'Alt+C', () => {
    let recorderWin = getRecorderWindow();
    let miniEditorWin = getMiniEditorWindow();
    if (recorderWin === null || miniEditorWin === null) {
      recorderWin === null && createRecorderWindow();
      miniEditorWin === null && createMiniEditorWindow();
      return;
    }

    if (recorderWin.isMinimized()) {
      recorderWin.restore();
      miniEditorWin.restore();
    } else {
      recorderWin.minimize();
      miniEditorWin.minimize();
    }
  });

  // 设置 tray
  // Q: 我的 tray 没有图标是咋回事
  // A: 你的图标路径不对，或者你的图标不是 png 格式
  const appIcon = nativeImage.createFromPath(path.join(__dirname, '../../../../assets/icon.png'))
  const tray = new Tray(appIcon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      role: 'quit'
    },
  ]);
  let handler: null | number = null;
  let doubleClick = true;

  tray.on('double-click', () => {
    if (handler != null) {
      clearTimeout(handler);
      handler = null;
    }
    doubleClick = true;
    setTimeout(() => {
      doubleClick = false;
    }, 100);
    createDashboardWindow();
  });

  tray.on('click', () => {
    if (handler != null) {
      clearTimeout(handler);
      handler = null;
    }
    setTimeout(() => {
      if (!doubleClick) {
        createRecorderWindow();
        createMiniEditorWindow();
      }
    }, 100);
  });
  tray.setContextMenu(contextMenu);
}
