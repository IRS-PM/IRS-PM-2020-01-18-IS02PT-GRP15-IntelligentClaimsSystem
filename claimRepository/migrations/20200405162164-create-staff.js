'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Staff', {
      ID: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      Name: { type: Sequelize.STRING },
      Pool1: { type: Sequelize.INTEGER.UNSIGNED },
      Pool2: { type: Sequelize.INTEGER.UNSIGNED }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Staff');
  }
};