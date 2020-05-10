'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ClaimItem', {
      ID: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      ClaimNo: { type: Sequelize.INTEGER.UNSIGNED, references: { model: { tableName: 'MedicalClaim' }, key: 'ClaimNo' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      ItemDesc: { type: Sequelize.STRING },
      BenefitCode: { type: Sequelize.STRING, allowNull: true, references: { model: { tableName: 'PolicyBenefit' }, key: 'BenefitCode' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      Qty: { type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0 },
      Amount: { type: Sequelize.FLOAT(10, 2), allowNull: false, defaultValue: 0 },
      ReceiptRef: { type: Sequelize.STRING }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ClaimItem');
  }
};