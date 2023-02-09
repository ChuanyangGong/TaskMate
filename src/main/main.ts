/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { app } from 'electron';
import { getConfigManager } from './config/ConfigManager';
import { initialDBManager } from './database/DatabaseManager';
import { createDashboardWindow, getDashboardWin } from './windows/dashboard';

// 初始化项目
(async () => {
  const cfgManager = getConfigManager();

  await initialDBManager(cfgManager.config?.userConfig.databasePath || '');

  // 初始化主线程环境
  if (cfgManager.config?.isDev) {
    require('electron-debug')();
  }

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
      createDashboardWindow();
      app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (getDashboardWin() === null) createDashboardWindow();
      });
    })
    .catch(console.log);
})();
