import { Model, DataTypes, Sequelize } from 'sequelize';

export class Category extends Model {
  declare id: number;
  declare name: string;
  declare finishedAt: Date;
  declare order: number;
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
      order: {
        type: DataTypes.INTEGER,
      }
    },
    { sequelize, paranoid: true }
  );
}
