import { Model, DataTypes, Sequelize } from 'sequelize';

export class TimeSlice extends Model {
  declare id: number;
  declare startAt: Date;
  declare endAt: Date;
  declare duration: number;
  declare taskId: number;
}

export function initTimeSlice(sequelize: Sequelize) {
  TimeSlice.init(
    {
      startAt: {
        type: DataTypes.DATE,
      },
      endAt: {
        type: DataTypes.DATE,
      },
      duration: {
        type: DataTypes.INTEGER,
      },
      taskId: {
        type: DataTypes.INTEGER,
      },
    },
    { sequelize, paranoid: false }
  );
}
