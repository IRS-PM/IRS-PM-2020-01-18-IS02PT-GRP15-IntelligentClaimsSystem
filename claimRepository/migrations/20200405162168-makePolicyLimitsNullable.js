'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'HealthPolicy',
        'PolicyYearLimit',
        { type: Sequelize.FLOAT(15, 2), allowNull: true, defaultValue: null }
      ),
      queryInterface.changeColumn(
        'HealthPolicy',
        'PolicyYearBalance',
        { type: Sequelize.FLOAT(15, 2), allowNull: true, defaultValue: null }
      ),
      queryInterface.changeColumn(
        'HealthPolicy',
        'LifetimeLimit',
        { type: Sequelize.FLOAT(15, 2), allowNull: true, defaultValue: null }
      ),
      queryInterface.changeColumn(
        'HealthPolicy',
        'LifetimeBalance',
        { type: Sequelize.FLOAT(15, 2), allowNull: true, defaultValue: null }
      )
    ])
  },
  down: (queryInterface, Sequelize) => {
    // don't revert because data may restrict this now
    return Promise.resolve()
  }
};