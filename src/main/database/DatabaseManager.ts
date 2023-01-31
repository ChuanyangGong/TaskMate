import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import { makeFileOrDir } from '../util';
import migrations from './migrations/migrations';
import initModels from './models/initialModels';

class DBManager {
  sequelize: Sequelize;

  // 初始化数据库连接管理对象
  constructor(databasePath: string) {
    // 确保数据库文件是否存在
    makeFileOrDir(databasePath, true, '');

    // 创建数据库连接
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: databasePath,
    });
  }
}

let dbManager: DBManager | null = null;

export async function initialDBManager(databasePath: string) {
  if (dbManager === null) {
    // 创建数据库管理实例
    dbManager = new DBManager(databasePath);

    // 尝试进行数据库迁移
    const umzug = new Umzug({
      migrations,
      logger: console,
      storage: new SequelizeStorage({ sequelize: dbManager.sequelize }),
      context: dbManager.sequelize.getQueryInterface(),
    });
    await umzug.up();

    // 初始化模型
    initModels(dbManager.sequelize);
    await dbManager.sequelize.sync();
  }
}

export function getDBManager() {
  return dbManager;
}
