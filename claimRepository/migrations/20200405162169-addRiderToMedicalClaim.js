'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate('MedicalClaim', {
      'Rider': 'N'
    }, {
      'Rider': {
        [Sequelize.Op.or]: {
          [Sequelize.Op.notIn]: ['Y', 'N'],
          [Sequelize.Op.eq]: null
        }
      }
    })

    await queryInterface.bulkUpdate('MedicalClaim', {
      'RiderPrdtCode': null
    }, {})

    return Promise.all([
      queryInterface.changeColumn(
        'MedicalClaim',
        'Rider',
        { type: Sequelize.ENUM('Y', 'N'), allowNull: false, defaultValue: 'N' }
      ),
      queryInterface.changeColumn(
        'MedicalClaim',
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
      queryInterface.changeColumn('MedicalClaim', 'Rider', { type: Sequelize.STRING }),
      queryInterface.changeColumn('MedicalClaim', 'RiderPrdtCode', { type: Sequelize.STRING }),
    ])
  }
};