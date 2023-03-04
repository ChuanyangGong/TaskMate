import { Sequelize } from 'sequelize';

export default {
  name: '230304_193100_create_task_records_table.js',
  async up({ context: queryInterface }) {
    await queryInterface.createTable('TaskRecords', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      detail: {
        type: Sequelize.STRING,
        default: "",
      },
      planStartAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      planEndAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      startAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
      categoryId: {
        type: Sequelize.INTEGER,
      },
    });
  },
  async down({ context: queryInterface }) {
    await queryInterface.dropTable('TaskRecords');
  },
};
