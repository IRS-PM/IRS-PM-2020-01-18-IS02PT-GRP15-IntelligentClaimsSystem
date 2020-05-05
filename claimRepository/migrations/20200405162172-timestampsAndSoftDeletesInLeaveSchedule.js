'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    return Promise.all([
      queryInterface.addColumn(
        'LeaveSchedule',
        'CreatedAt',
        { type: Sequelize.DATE, allowNull: false, defaultValue: queryInterface.sequelize.literal('CURRENT_TIMESTAMP') }
      ),
      queryInterface.addColumn(
        'LeaveSchedule',
        'UpdatedAt',
        { type: Sequelize.DATE, allowNull: true, defaultValue: null }
      ),
      queryInterface.addColumn(
        'LeaveSchedule',
        'DeletedAt',
        { type: Sequelize.DATE, allowNull: true, defaultValue: null }
      )
    ])
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(
        'LeaveSchedule',
        'CreatedAt'
      ),
      queryInterface.removeColumn(
        'LeaveSchedule',
        'UpdatedAt'
      ),
      queryInterface.removeColumn(
        'LeaveSchedule',
        'DeletedAt'
      )
    ])
  }
};