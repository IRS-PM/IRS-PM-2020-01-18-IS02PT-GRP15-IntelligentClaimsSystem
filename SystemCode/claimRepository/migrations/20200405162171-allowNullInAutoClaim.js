'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    return Promise.all([
      queryInterface.changeColumn(
        'MedicalClaim',
        'AutoClaim',
        { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: null }
      )
    ])
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'MedicalClaim',
        'AutoClaim',
        { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: 1 }
      )
    ])
  }
};