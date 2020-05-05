'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Settings', {
      ID: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      LastSchedulerRunTime: { type: Sequelize.DATE, allowNull: true, defaultValue: null }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Settings');
  }
};