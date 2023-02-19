import { Model, DataTypes, Sequelize } from 'sequelize';

export class TagAlias extends Model {
  declare name: string;
  declare tagId: number;
}

export function initTagAlias(sequelize: Sequelize) {
  TagAlias.init(
    {
      name: {
        type: DataTypes.STRING,
      },
      tagId: {
        type: DataTypes.INTEGER,
      },
    },
    { sequelize, paranoid: true }
  );
}
