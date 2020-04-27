const Sequelize = require('sequelize')
const { db } = require('../db/mysql.js')

class ClaimItem extends Sequelize.Model {}

ClaimItem.init({
  ID: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  ClaimNo: { type: Sequelize.INTEGER.UNSIGNED, references: { modelName: 'MedicalClaim', key: 'ClaimNo' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  ItemDesc: { type: Sequelize.STRING },
  BenefitCode: { type: Sequelize.STRING, allowNull: true, references: { modelName: 'PolicyBenefit', key: 'BenefitCode' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
  Qty: { type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0 },
  Amount: { type: Sequelize.FLOAT(10, 2), allowNull: false, defaultValue: 0 },
  ReceiptRef: { type: Sequelize.STRING }
}, {
  sequelize: db,
  modelName: 'ClaimItem',
  tableName: 'ClaimItem',
  timestamps: false
})

module.exports = ClaimItem