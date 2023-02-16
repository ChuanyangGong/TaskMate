import { Model, DataTypes, Sequelize } from 'sequelize';

export class Category extends Model {
  declare name: string;

  declare finishedAt: Date;
}

export function initCategory(sequelize: Sequelize) {
  Category.init(
    {
      name: {
        type: DataTypes.STRING,
      },
      finishedAt: {
        type: DataTypes.DATE,
      },
    },
    { sequelize, paranoid: true }
  );
}
