/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { app, globalShortcut } from 'electron';
import { getConfigManager } from './config/ConfigManager';
import { initialDBManager } from './database/DatabaseManager';
import initialCommonHandler from './windows/common';
import { createDashboardWindow, getDashboardWin } from './windows/dashboard';
import { createRecorderWindow, getRecorderWindow } from './windows/recorder';
import { createMiniEditorWindow, getMiniEditorWindow } from './windows/miniEditor';

// 初始化项目
(async () => {
  const cfgManager = getConfigManager();

  await initialDBManager(cfgManager.config?.userConfig.databasePath || '');

  // 初始化主线程环境
  if (cfgManager.config?.isDev) {
    require('electron-debug')();
  }

  // 初始化事件处理
  await initialCommonHandler();

  // 定义程序事件处理
  app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app
    .whenReady()
    .then(() => {
      createMiniEditorWindow();
      createRecorderWindow();
      // createDashboardWindow();
      app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        // if (getDashboardWin() === null) createDashboardWindow();
        if (getRecorderWindow() === null) createRecorderWindow();
        if (getMiniEditorWindow() === null) createMiniEditorWindow();
      });
    })
    .then(() => {
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
        } else if (recorderWin.isFocused() || miniEditorWin.isFocused()) {
          recorderWin.blur();
          miniEditorWin.blur();
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
    })
    .catch(console.log);
})();
