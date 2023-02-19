import { Sequelize } from 'sequelize';

export default {
  name: '230219_170100_create_tag_aliases_table.js',
  async up({ context: queryInterface }) {
    await queryInterface.createTable('TagAliases', {
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
      tagId: {
        type: Sequelize.INTEGER,
      },
    });
  },
  async down({ context: queryInterface }) {
    await queryInterface.dropTable('TagAliases');
  },
};
