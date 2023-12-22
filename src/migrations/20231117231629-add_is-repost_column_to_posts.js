'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Posts", "is_repost", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after: 'edited',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Posts", "is_repost");
  }
};
