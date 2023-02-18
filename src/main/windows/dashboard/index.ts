import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import { Op, Sequelize } from 'sequelize';
import { Category } from '../../database/models/Category';
import { resolveHtmlPath } from '../../util';
import MenuBuilder from '../../menu';
import { createRecorderWindow } from '../recorder';
import { FilterItemFormDataType } from 'typings/renderer/dashboard/components/TaskMenu';
import { CategoryAlias } from '../../database/models/CategoryAlias';

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

// 获取某一个分类或标签的详情
ipcMain.handle('dashboard:getItemDetailByType', async (event, type: string, id: number) => {
  if (type === 'category') {
    const category = (await Category.findByPk(id))?.toJSON();
    // 查找不到
    if (category === null) {
      return null;
    }
    const shortNames = await CategoryAlias.findAll({
      where: {
        categoryId: {
          [Op.eq]: category.id,
        },
      },
    });
    category.children = shortNames.map((item) => item.toJSON().name);
    return category;
  } else {
    return null;
  }
});

// 添加或更新分类、标签
ipcMain.handle('dashboard:saveOrNewItemByType', async (event, type: string, data: FilterItemFormDataType) => {
  if (type === 'category') {
    // 更新分类
    let newOrder: number = await Category.max('order');
    newOrder += 100;
    let category: Category | null;
    if (data.id === 0) {
      category = await Category.create({
        name: data.name,
        order: newOrder,
      })
    } else {
      category = await Category.findByPk(data.id);
      if (category === null) {
        return false;
      }
      category.name = data.name;
      category.order = data.order ?? category.order;
      await category.save();
    }
    // 更新别名
    data.shortNames?.forEach(async (name) => {
      await CategoryAlias.findOrCreate({
        where: { name },
        defaults: {
          name,
          categoryId: category?.id,
        }
      })
    });
    await CategoryAlias.destroy({
      where: {
        categoryId: category?.id,
        name: {
          [Op.notIn]: data.shortNames ?? [],
        },
      }
    })
  } else {}
  return true;
});

export const getDashboardWin = () => {
  return dashboardWindow;
};
