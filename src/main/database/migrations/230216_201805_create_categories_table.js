import { Sequelize } from 'sequelize';

export default {
  name: '230216_201805_create_categories_table.js',
  async up({ context: queryInterface }) {
    await queryInterface.createTable('Categories', {
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
    await queryInterface.addIndex('Categories', ['order'], {
      indexName: 'Categories_order',
    });
  },
  async down({ context: queryInterface }) {
    await queryInterface.dropTable('Categories');
  },
};
