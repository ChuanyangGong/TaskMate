import { Sequelize } from 'sequelize';

export default {
  name: '230216_203005_create_category_aliases_table.js',
  async up({ context: queryInterface }) {
    await queryInterface.createTable('CategoryAliases', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable('CategoryAliases');
  },
};
