import { Model, DataTypes, Sequelize } from 'sequelize';
import { Category } from './Category';
import { Tag } from './Tag';
import { TimeSlice } from './TimeSlice';

export class TaskRecord extends Model {
  declare id: number;
  declare title: string | null;
  declare detail: string | null;
  declare planStartAt: Date | null;
  declare planEndAt: Date | null;
  declare startAt: Date | null;
  declare endAt: Date | null;
  declare duration: number | null;
  declare status: number | null;
  declare timeSlices: TimeSlice[] | null;
  declare tags: Tag[] | null;
  declare category: Category | null;
  declare categoryId: number | null;
  declare setTimeSlices: (timeSlices: TimeSlice[], option?: any) => void;
  declare setTags: (tags: Tag[], option?: any) => void;
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
