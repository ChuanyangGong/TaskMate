import { Sequelize } from 'sequelize';
import { Category, initCategory } from './Category';
import { CategoryAlias, initCategoryAlias } from './CategoryAlias';
import { Tag, initTag } from './Tag';
import { TagAlias, initTagAlias } from './TagAlias';
import { TaskRecord, initTaskRecord } from './TaskRecord';
import { TimeSlice, initTimeSlice } from './TimeSlice';

export default async function initModels(sequelize: Sequelize) {
  // 初始化模型
  initCategory(sequelize);
  initCategoryAlias(sequelize);
  initTag(sequelize);
  initTagAlias(sequelize);
  initTaskRecord(sequelize);
  initTimeSlice(sequelize);

  // 建立关系
  Category.hasMany(CategoryAlias, {
    foreignKey: 'categoryId',
    as: 'CategoryAliases'
  });
  CategoryAlias.belongsTo(Category);

  Tag.hasMany(TagAlias, {
    foreignKey: 'tagId',
    as: 'TagAliases'
  });
  TagAlias.belongsTo(Tag);

  Category.hasMany(TaskRecord, {
    foreignKey: 'categoryId',
  });
  TaskRecord.belongsTo(Category, { foreignKey: 'categoryId', as: 'Category' });

  TaskRecord.belongsToMany(Tag, { through: 'TaskRecord_Tag', as: 'Tag' });
  Tag.belongsToMany(TaskRecord, { through: 'TaskRecord_Tag' });

  TimeSlice.belongsTo(TaskRecord, { foreignKey: 'taskId' });
  TaskRecord.hasMany(TimeSlice, { foreignKey: 'taskId', as: 'TimeSlice' });
}
