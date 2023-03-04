import { Model, DataTypes, Sequelize } from 'sequelize';

export class TaskRecord extends Model {
  declare name: string;
  declare tagId: number;
}

export function initTaskRecord(sequelize: Sequelize) {
  TaskRecord.init(
    {
      title: {
        type: DataTypes.STRING,
      },
      detail: {
        type: DataTypes.STRING,
      },
      planStartAt: {
        type: DataTypes.DATE,
      },
      planEndAt: {
        type: DataTypes.DATE,
      },
      startAt: {
        type: DataTypes.DATE,
      },
      endAt: {
        type: DataTypes.DATE,
      },
      duration: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.INTEGER,
      },
      categoryId: {
        type: DataTypes.INTEGER,
      },
    },
    { sequelize, paranoid: true }
  );
}
