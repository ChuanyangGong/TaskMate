import { app, BrowserWindow, ipcMain, nativeImage, shell } from 'electron';
import path from 'path';
import { Op, Sequelize } from 'sequelize';
import { Category } from '../../database/models/Category';
import { resolveHtmlPath } from '../../util';
import MenuBuilder from '../../menu';
import { createRecorderWindow, getRecorderWindow } from '../recorder';
import { FilterItemFormDataType } from 'typings/renderer/dashboard/components/TaskMenu';
import { CategoryAlias } from '../../database/models/CategoryAlias';
import { Tag } from '../../database/models/Tag';
import { TagAlias } from '../../database/models/TagAlias';
import { FilterParamType, TaskDetailItemType } from 'typings/renderer/dashboard/App';
import { TaskRecord } from '../../database/models/TaskRecord';
import { getDBManager } from '../../database/DatabaseManager';
import { TimeSlice } from '../../database/models/TimeSlice';
import { getMiniEditorWindow } from '../miniEditor';

let dashboardWindow: BrowserWindow | null = null;

function isCategory(type: string) {
  return type === 'category';
}

export const createDashboardWindow = async () => {
  // 检查时候存在 dashboard 窗口
  if (dashboardWindow !== null) {
    dashboardWindow.restore();
    dashboardWindow.focus();
    return;
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  dashboardWindow = new BrowserWindow({
    show: false,
    width: 1224,
    height: 600,
    minWidth: 1224,
    minHeight: 600,
    icon: getAssetPath('icon.png'),
    frame: false,
    transparent: true,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../../../.erb/dll/preload.js'),
    }
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

// 获取分类 或 标签列表
ipcMain.handle('dashboard:getFilterListChildren', async () => {
  const searchObj = [Category, Tag];
  const lists = searchObj.map((obj) => {
    return obj.findAll({
      where: { finishedAt: { [Op.is]: null } },
      order: Sequelize.col('order'),
      include: [
        {
          model: obj === Category ? CategoryAlias : TagAlias,
          as: obj === Category ? 'CategoryAliases' : 'TagAliases',
          attributes: ['name'],
        },
      ],
    });
  });
  const promiseLise = Promise.all(lists);
  const res = await promiseLise;
  return {
    category: res[0].map((item) => item.toJSON()),
    tag: res[1].map((item) => item.toJSON()),
  };
});

// 获取分类详情
ipcMain.handle('dashboard:getCategoryDetail', async (event, categoryId: number | null) => {
  if (categoryId === null) {
    return null;
  }
  const category = (await Category.findByPk(categoryId))?.toJSON();
  return category;
});

// 获取某一个分类或标签的详情
ipcMain.handle('dashboard:getItemDetailByType', async (event, type: string, id: number) => {
  if (isCategory(type)) {
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
    const tag = (await Tag.findByPk(id))?.toJSON();
    // 查找不到
    if (tag === null) {
      return null;
    }
    const shortNames = await TagAlias.findAll({
      where: {
        tagId: {
          [Op.eq]: tag.id,
        },
      },
    });
    tag.children = shortNames.map((item) => item.toJSON().name);
    return tag;
  }
});

// 添加或更新分类、标签
ipcMain.handle('dashboard:saveOrNewItemByType', async (_, type: string, data: FilterItemFormDataType) => {
  if (isCategory(type)) {
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
  } else {
    let newOrder: number = await Tag.max('order');
    newOrder += 100;
    let tag: Tag | null;
    if (data.id === 0) {
      tag = await Tag.create({
        name: data.name,
        order: newOrder,
      })
    } else {
      tag = await Tag.findByPk(data.id);
      if (tag === null) {
        return false;
      }
      tag.name = data.name;
      tag.order = data.order ?? tag.order;
      await tag.save();
    }
    // 更新别名
    data.shortNames?.forEach(async (name) => {
      await TagAlias.findOrCreate({
        where: { name },
        defaults: {
          name,
          tagId: tag?.id,
        }
      })
    });
    await TagAlias.destroy({
      where: {
        tagId: tag?.id,
        name: {
          [Op.notIn]: data.shortNames ?? [],
        },
      }
    })
  }
  return true;
});

// 删除分类、标签
ipcMain.handle('dashboard:deleteCategoryOrTagItemByType', async (_, type: string, id: number) => {
  if (id === -1) {
    return false;
  }
  if (type === 'category') {
    // 删除别名
    await CategoryAlias.destroy({ where: { categoryId: id } });
    await Category.destroy({ where: { id }});
  } else {
    await TagAlias.destroy({ where: { tagId: id } });
    await Tag.destroy({ where: { id }});
  }
  return true;
});

// 根据过滤条件获取任务列表数据
ipcMain.handle('dashboard:getTaskListData', async (_, filterParam: FilterParamType) => {
  const categoryInclude: any = { model: Category, as: 'Category' };
  const tagInclude: any = { model: Tag, as: 'Tag' };
  const whereStatement: any = { status: filterParam.taskStatus, [Op.and]: []};

  // 填充 keyword 过滤条件
  if (filterParam?.keyword !== '') {
    whereStatement[Op.and].push({ [Op.or]: [{
      title: { [Op.like]: '%' + filterParam?.keyword + '%' }
    },{
      detail: { [Op.like]: '%' + filterParam?.keyword + '%' }
    }]});
  }

  // 填充按类别或标签过滤的条件
  if (filterParam?.categoryId) {
    whereStatement.categoryId = filterParam.categoryId;
  }
  if (filterParam?.tagId) {
    tagInclude.where = { id: { [Op.in]: [filterParam.tagId] }};
  }

  // 填充按时间过滤的条件
  if(Array.isArray(filterParam.dateRangeString)) {
    let orState: any[] = [];
    if (filterParam.taskStatus === 0) {
      orState.push({ planStartAt: { [Op.gt]: filterParam.dateRangeString[0], [Op.lt]: filterParam.dateRangeString[1]} });
      orState.push({ planEndAt: { [Op.gt]: filterParam.dateRangeString[0], [Op.lt]: filterParam.dateRangeString[1]} });
    } else if (filterParam.taskStatus === 1) {
      orState.push({ startAt: { [Op.gt]: filterParam.dateRangeString[0], [Op.lt]: filterParam.dateRangeString[1]} });
      orState.push({ endAt: { [Op.gt]: filterParam.dateRangeString[0], [Op.lt]: filterParam.dateRangeString[1]} });
    }
    whereStatement[Op.and].push({ [Op.or]: orState});
  }

  const tasks = await TaskRecord.findAll({
    where: whereStatement,
    include: [
      categoryInclude,
      tagInclude,
    ],
    order: [
      ['createdAt', 'DESC']
    ]
  })
  const tasksRes = tasks.map(item => item.toJSON());
  return tasksRes;
});

// 通过 id 获取任务详情
ipcMain.handle('dashboard:getTaskDetailById', async (_, id: number) => {
  const task = await TaskRecord.findByPk(id, {
    include: [
      { model: Category, as: 'Category' },
      { model: Tag, as: 'Tag' },
      { model: TimeSlice, as: 'TimeSlice' },
    ]
  });
  const taskRes = task?.toJSON();
  return taskRes;
});

// 新建或者更新任务
ipcMain.handle('dashboard:updateOrCreateTask', async (event, taskRecord: TaskDetailItemType) => {
  const dbManager = getDBManager();
  let taskId = -1;
  await dbManager?.sequelize.transaction(async (t) => {
    let taskItem = await TaskRecord.findByPk(taskRecord?.id || -1, { transaction: t });

    // 判断是否存在，如果不存在就新建一个
    if (taskItem === null) {
      taskItem = await TaskRecord.create({}, { transaction: t });
    }
    taskItem.title = taskRecord?.title || taskItem.title;
    taskItem.detail = taskRecord?.detail || taskItem.detail;
    if (taskRecord.forceUpdateCategory === true) {
      taskItem.categoryId = taskRecord.categoryId !== undefined ? taskRecord.categoryId : null;
    } else {
      taskItem.categoryId = taskRecord?.categoryId || taskItem.categoryId;
    }
    taskItem.planStartAt = taskRecord?.planStartAt || taskItem.planStartAt;
    taskItem.planEndAt = taskRecord?.planEndAt || taskItem.planEndAt;
    taskItem.startAt = taskRecord?.startAt || taskItem.startAt;
    taskItem.endAt = taskRecord?.endAt || taskItem.endAt;
    taskItem.status = taskRecord?.status !== undefined ? taskRecord?.status : taskItem.status;

    // 更新时间片
    if (taskRecord?.updateTimeSliceList) {
      // 删除所有该任务的时间片
      await TimeSlice.destroy({
        where: {
          taskId: taskItem?.id,
        },
        transaction: t,
      });
      // 创建新的时间片
      const timeSliceList = taskRecord.timeSliceList?.map(item => {
        return {
          taskId: taskItem?.id,
          startAt: item.startAt,
          endAt: item.endAt,
          duration: item.duration,
        }
      }
      );
      await TimeSlice.bulkCreate(timeSliceList || [], { transaction: t });
      taskItem.duration = taskRecord?.duration || taskItem.duration;
    }

    // 更新标签
    if (taskRecord?.updateTagList) {
      const tags = await Tag.findAll({
        where: {
          id: taskRecord.tagIds || [],
        }
      })
      taskItem.setTags(tags, { transaction: t });
    }

    await taskItem.save({ transaction: t });

    taskId = taskItem?.id || -1;
    // 触发列表刷新
    dashboardWindow?.webContents.send('dashboard:invokeRefreshTaskList');
  });
  return taskId;
});

// 通过 id 删除任务
ipcMain.handle('dashboard:deleteTaskById', async (_, id: number) => {
  if (id === -1) {
    return false;
  }
  await TaskRecord.destroy({ where: { id }});
  // 触发列表刷新
  dashboardWindow?.webContents.send('dashboard:invokeRefreshTaskList');
  return true;
});

ipcMain.handle('dashboard:setContinueTask', async (_, id: number) => {
  if (id !== -1) {
    const task = await TaskRecord.findByPk(id, {
      include: [
        { model: Category, as: 'Category' },
        { model: Tag, as: 'Tag' },
        { model: TimeSlice, as: 'TimeSlice' },
      ]
    });
    const taskRes = task?.toJSON();
    let recorder = getRecorderWindow();
    recorder?.webContents.send('recoder:invokeContinueTask', taskRes);
  }
});

ipcMain.handle('dashboard:handleSendMessage', async (_, message: string, type: string) => {
  dashboardWindow?.webContents.send('dashboard:invokeSendMessage', message, type);
});

export const getDashboardWin = () => {
  return dashboardWindow;
};
