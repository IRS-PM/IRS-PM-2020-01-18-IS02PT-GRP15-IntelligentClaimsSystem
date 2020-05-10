'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ClaimStaff', {
      ID: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      ClaimNo: { type: Sequelize.INTEGER.UNSIGNED, references: { model: { tableName: 'MedicalClaim'}, key: 'ClaimNo' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      StaffID: { type: Sequelize.INTEGER.UNSIGNED, references: { model: { tableName: 'Staff'}, key: 'ID' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      PolicyNo: { type: Sequelize.STRING, allowNull: true, references: { model: { tableName: 'HealthPolicy'}, key: 'PolicyNo' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      AssignedForDate: { type: Sequelize.DATE },
      CreatedDate: { type: Sequelize.DATE },
      UpdatedDate: { type: Sequelize.DATE }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ClaimStaff');
  }
};