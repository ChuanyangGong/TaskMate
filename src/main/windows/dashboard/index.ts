import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import { Op, Sequelize } from 'sequelize';
import { Category } from '../../database/models/Category';
import { resolveHtmlPath } from '../../util';
import MenuBuilder from '../../menu';
import { createRecorderWindow } from '../recorder';

let dashboardWindow: BrowserWindow | null = null;

export const createDashboardWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  dashboardWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 600,
    minWidth: 1024,
    minHeight: 600,
    icon: getAssetPath('icon.png'),
    frame: false,
    transparent: true,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../../../.erb/dll/preload.js'),
    },
  });

  dashboardWindow.loadURL(resolveHtmlPath('dashboard.html'));

  dashboardWindow.on('ready-to-show', () => {
    if (!dashboardWindow) {
      throw new Error('"dashboardWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      dashboardWindow.minimize();
    } else {
      dashboardWindow.show();
    }
  });

  dashboardWindow.on('closed', () => {
    dashboardWindow = null;
  });
};

ipcMain.on('openAnotherWindow', async (event, arg) => {
  try {
    createRecorderWindow();
  } catch (e) {
    console.log({ e });
  }
});

// 获取分类列表
ipcMain.handle('dashboard:getCategoryList', async () => {
  const categoryList = await Category.findAll({
    where: {
      finishedAt: {
        [Op.is]: null,
      },
    },
    order: Sequelize.col('order'),
  });
  return categoryList.map((item) => item.toJSON());
});

export const getDashboardWin = () => {
  return dashboardWindow;
};
