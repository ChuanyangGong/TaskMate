import { Sequelize } from 'sequelize';
import { User, initUser } from './User';
import { Role, initRole } from './Role';

export default function initModels(sequelize: Sequelize) {
  // 初始化模型
  initUser(sequelize);
  initRole(sequelize);

  // 建立关系
  User.belongsToMany(Role, { through: 'UserRoles' });
  Role.belongsToMany(User, { through: 'UserRoles' });
}
