'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('MedicalPanel', {
      PanelID: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      PanelType: { type: Sequelize.INTEGER(1).UNSIGNED, defaultValue: 1 },
      SpecialistName: { type: Sequelize.STRING },
      RegistrationNo: { type: Sequelize.STRING },
      Specialty: { type: Sequelize.STRING },
      BlacklistReasonID: { type: Sequelize.INTEGER, allowNull: true, defaultValue: null },
      BlacklistPeriodFrom: { type: Sequelize.DATE, allowNull: true, defaultValue: null },
      BlacklistPeriodUntil: { type: Sequelize.DATE, allowNull: true, defaultValue: null }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('MedicalPanel');
  }
};