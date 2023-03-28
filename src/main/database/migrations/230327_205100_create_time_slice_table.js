import { Sequelize } from 'sequelize';

export default {
  name: '230327_205100_create_time_slices_table.js',
  async up({ context: queryInterface }) {
    await queryInterface.createTable('TimeSlice', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      startAt: {
        type: Sequelize.DATE,
      },
      endAt: {
        type: Sequelize.DATE,
      },
      duration: {
        type: Sequelize.INTEGER,
      },
      taskId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  async down({ context: queryInterface }) {
    await queryInterface.dropTable('TimeSlices');
  },
};
