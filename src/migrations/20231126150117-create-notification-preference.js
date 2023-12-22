'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('NotificationPreferences', {
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
      busquedaEmpresas: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      conectarComunidades: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      publicaciones: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      actividadComunidades: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      actualizacionesPerfil: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
    await queryInterface.dropTable('NotificationPreferences');
  }
};