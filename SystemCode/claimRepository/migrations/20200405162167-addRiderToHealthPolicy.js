'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'HealthPolicy',
        'Rider',
        { type: Sequelize.ENUM('Y', 'N'), allowNull: false, defaultValue: 'N' }
      ),
      queryInterface.addColumn(
        'HealthPolicy',
        'RiderPrdtCode',
        { 
          type: Sequelize.STRING, 
          references: {
            model: {
              tableName: 'ProductPlan'
            },
            key: 'ProductCode'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          defaultValue: null
        }
      ),
    ])
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('HealthPolicy', 'Rider'),
      queryInterface.removeColumn('HealthPolicy', 'RiderPrdtCode'),
    ])
  }
};