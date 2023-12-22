'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.STRING,
        references: {model: 'usuarias', key: 'id'},
        onDelete: 'CASCADE'
      },
      content: {
        type: Sequelize.STRING
      },
      triggerUserId: {
        type: Sequelize.STRING,
        references: {model: 'usuarias', key: 'id'},
        onDelete: 'CASCADE'
      },
      postId: {
        type: Sequelize.INTEGER,
        references: {model: 'Posts', key: 'id'},
        onDelete: 'CASCADE',
      },
      section: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      seen: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('Notifications');
  }
};