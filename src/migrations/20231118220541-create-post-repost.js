'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PostReposts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      newPostId: {
        type: Sequelize.INTEGER,
        references: {model: 'Posts', key: 'id'},
        onDelete: 'CASCADE',
      },
      originalPostId: {
        type: Sequelize.INTEGER,
        references: {model: 'Posts', key: 'id'},
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PostReposts');
  }
};