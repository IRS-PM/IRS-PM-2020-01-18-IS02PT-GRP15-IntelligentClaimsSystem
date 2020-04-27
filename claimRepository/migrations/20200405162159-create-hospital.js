'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Hospital', {
      HospitalCode: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
      HospitalName: { type: Sequelize.STRING },
      HospitalType: { type: Sequelize.ENUM('1', '0'), defaultValue: '1' }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Hospital');
  }
};