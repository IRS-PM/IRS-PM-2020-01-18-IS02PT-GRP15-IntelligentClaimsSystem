'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('LeaveSchedule', {
      ID: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      StaffID: { type: Sequelize.INTEGER.UNSIGNED, references: { model: {  tableName: 'Staff' }, key: 'ID' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      StartDateTime: { type: Sequelize.DATE, allowNull: false },
      EndDateTime: { type: Sequelize.DATE, allowNull: false },
      IsAbsent: { type: Sequelize.BOOLEAN, defaultValue: false }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('LeaveSchedule');
  }
};