'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PolicyBenefit', {
      BenefitCode: { type: Sequelize.STRING, primaryKey: true },
      ProductCode: { 
        type: Sequelize.STRING, 
        references: {
          model: { tableName: 'ProductPlan' },
          key: 'ProductCode'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      Description: { type: Sequelize.TEXT },
      BenefitLimit: { type: Sequelize.FLOAT(10, 2), allowNull: false, defaultValue: 0 }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PolicyBenefit');
  }
};