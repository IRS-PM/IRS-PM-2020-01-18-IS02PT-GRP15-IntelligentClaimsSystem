'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DiagnosisCode', {
      DiagnosisCode: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
      Description: { type: Sequelize.TEXT },
      AutoReject: { type: Sequelize.ENUM('Y', 'N'), defaultValue: null, allowNull: true },
      ICDType: { type: Sequelize.INTEGER },
      MinorClaims: { type: Sequelize.ENUM('Y', 'N'), defaultValue: null, allowNull: true }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('DiagnosisCode');
  }
};