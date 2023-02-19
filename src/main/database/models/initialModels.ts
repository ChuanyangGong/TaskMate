import { Sequelize } from 'sequelize';
import { Category, initCategory } from './Category';
import { CategoryAlias, initCategoryAlias } from './CategoryAlias';
import { Tag, initTag } from './Tag';
import { TagAlias, initTagAlias } from './TagAlias';

export default async function initModels(sequelize: Sequelize) {
  // 初始化模型
  initCategory(sequelize);
  initCategoryAlias(sequelize);
  initTag(sequelize);
  initTagAlias(sequelize);

  // 建立关系
  Category.hasMany(CategoryAlias, {
    foreignKey: 'categoryId',
  });
  CategoryAlias.belongsTo(Category);

  Tag.hasMany(TagAlias, {
    foreignKey: 'tagId',
  });
  TagAlias.belongsTo(Tag);
}
