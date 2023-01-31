import { Model, DataTypes, Sequelize } from 'sequelize';

export class Role extends Model {
  declare name: string;
}

export function initRole(sequelize: Sequelize) {
  Role.init(
    {
      name: {
        type: DataTypes.STRING,
      },
    },
    { sequelize, paranoid: true }
  );
}
