import { Sequelize } from 'sequelize';
import { Category, initCategory } from './Category';
import { CategoryAlias, initCategoryAlias } from './CategoryAlias';

export default function initModels(sequelize: Sequelize) {
  // 初始化模型
  initCategory(sequelize);
  initCategoryAlias(sequelize);

  // 建立关系
  Category.hasMany(CategoryAlias, {
    foreignKey: 'categoryId',
  });
  CategoryAlias.belongsTo(Category);
}
