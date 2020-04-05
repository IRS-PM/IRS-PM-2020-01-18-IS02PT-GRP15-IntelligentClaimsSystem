'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('HealthPolicy', {
      PolicyNo: { type: Sequelize.STRING, primaryKey: true },
      PolicyHolderId: { type: Sequelize.STRING },
      InsuredId: { type: Sequelize.STRING },
      Status: { type: Sequelize.INTEGER },
      EffectiveDate: { type: Sequelize.DATE },
      ExpiryDate: { type: Sequelize.DATE },
      PremiumAmount: { type: Sequelize.FLOAT(10, 2) },
      OutstandingPremium: { type: Sequelize.FLOAT(10, 2) },
      ProductCode: { type: Sequelize.STRING },
      CommencementDate: { type: Sequelize.DATE },
      EntryDate: { type: Sequelize.DATE },
      ReinstatementDate: { type: Sequelize.DATE },
      RiderEntryDate: { type: Sequelize.DATE },
      RiderCommencementDate: { type: Sequelize.DATE },
      RiderReinstatementDate: { type: Sequelize.DATE }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('HealthPolicy');
  }
};