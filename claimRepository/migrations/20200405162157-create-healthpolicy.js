'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('HealthPolicy', {
      PolicyNo: { type: Sequelize.STRING, primaryKey: true },
      PolicyHolderID: { type: Sequelize.STRING },
      PolicyHolderName: { type: Sequelize.STRING },
      InsuredID: { type: Sequelize.STRING },
      InsuredName: { type: Sequelize.STRING },
      InsuredDOB: { type: Sequelize.DATEONLY },
      PXIllness: { type: Sequelize.STRING },
      Status: { type: Sequelize.INTEGER(1).UNSIGNED }, // 1 = Inforce, 2 = Terminated
      EffectiveDate: { type: Sequelize.DATE },
      ExpiryDate: { type: Sequelize.DATE },
      PremiumAmount: { type: Sequelize.FLOAT(10, 2), allowNull: false, defaultValue: 0 },
      RiderPremiumAmount: { type: Sequelize.FLOAT(10, 2), allowNull: false, defaultValue: 0 },
      OutstandingPremium: { type: Sequelize.FLOAT(10, 2), allowNull: false, defaultValue: 0 },
      RiderOutstandingPremium: { type: Sequelize.FLOAT(10, 2), allowNull: false, defaultValue: 0 },
      ProductCode: { 
        type: Sequelize.STRING, 
        references: {
          model: { tableName: 'ProductPlan' },
          key: 'ProductCode'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      EntryDate: { type: Sequelize.DATE },
      CommencementDate: { type: Sequelize.DATE },
      ReinstatementDate: { type: Sequelize.DATE },
      RiderEntryDate: { type: Sequelize.DATE },
      RiderCommencementDate: { type: Sequelize.DATE },
      RiderReinstatementDate: { type: Sequelize.DATE },
      AllowAutoClaim: { type: Sequelize.ENUM('Y', 'N'), allowNull: false, defaultValue: 'Y' },
      PolicyYearLimit: { type: Sequelize.FLOAT(10, 2), allowNull: false, defaultValue: 0 },
      PolicyYearBalance: { type: Sequelize.FLOAT(10, 2), allowNull: false, defaultValue: 0 },
      LifeTimeLimit: { type: Sequelize.FLOAT(10, 2), allowNull: false, defaultValue: 0 },
      LifeTimeBalance: { type: Sequelize.FLOAT(10, 2), allowNull: false, defaultValue: 0 }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('HealthPolicy');
  }
};