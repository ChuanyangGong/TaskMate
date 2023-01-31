import { Model, DataTypes, Sequelize } from 'sequelize';

export class User extends Model {
  declare name: string;
}

export function initUser(sequelize: Sequelize) {
  User.init(
    {
      name: {
        type: DataTypes.STRING,
      },
    },
    { sequelize, paranoid: true }
  );
}
