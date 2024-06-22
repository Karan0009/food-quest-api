'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      country_code: {
        type: Sequelize.STRING(5),
        defaultValue: '+91',
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      profile_picture: {
        type: Sequelize.STRING(200),
        defaultValue: '',
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'active',
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  },
};
