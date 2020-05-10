const Sequelize = require('sequelize')
const { db } = require('../db/mysql.js')

class PolicyBeneft extends Sequelize.Model {}

PolicyBeneft.init({
  BenefitCode: { type: Sequelize.STRING, primaryKey: true },
  ProductCode: { 
    type: Sequelize.STRING, 
    references: {
      modelName: 'ProductPlan',
      key: 'ProductCode'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  Description: { type: Sequelize.TEXT },
  BenefitLimit: { type: Sequelize.FLOAT(10, 2), allowNull: false, defaultValue: 0 }
}, {
  sequelize: db,
  modelName: 'PolicyBenefit',
  tableName: 'PolicyBenefit',
  timestamps: false
})

module.exports = PolicyBeneft