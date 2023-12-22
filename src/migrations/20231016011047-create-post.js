'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
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
      communityId: {
        type: Sequelize.INTEGER,
        references: {model: 'Communities', key: 'id'},
        onDelete: 'CASCADE'
      },
      edited: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      interactions: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      content: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Posts');
  }
};