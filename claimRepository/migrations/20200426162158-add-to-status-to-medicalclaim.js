'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('MedicalClaim', 'Officer', Sequelize.STRING),
      queryInterface.addColumn('MedicalClaim', 'ClassificationStatus', Sequelize.ENUM(['pending', 'approved', 'rejected', 'humanIntervention']))
    ])
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('MedicalClaim', 'Officer'),
      queryInterface.removeColumn('MedicalClaim', 'ClassificationStatus')
    ])
  }
};