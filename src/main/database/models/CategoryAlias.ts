import { Model, DataTypes, Sequelize } from 'sequelize';

export class CategoryAlias extends Model {
  declare name: string;
  declare categoryId: number;
}

export function initCategoryAlias(sequelize: Sequelize) {
  CategoryAlias.init(
    {
      name: {
        type: DataTypes.STRING,
      },
      categoryId: {
        type: DataTypes.INTEGER,
      },
    },
    { sequelize, paranoid: true }
  );
}
