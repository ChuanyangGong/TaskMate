import { Sequelize } from 'sequelize';

export default {
  name: '230219_170000_create_tags_table.js',
  async up({ context: queryInterface }) {
    await queryInterface.createTable('Tags', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 10000,
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
      finishedAt: {
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addIndex('Tags', ['order'], {
      indexName: 'Tags_order',
    });
  },
  async down({ context: queryInterface }) {
    await queryInterface.dropTable('Tags');
  },
};
