const Sequelize = require('sequelize')
const { db } = require('../db/mysql.js')

class ClaimStaff extends Sequelize.Model {}

ClaimStaff.init({
  ID: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  ClaimNo: { type: Sequelize.INTEGER.UNSIGNED, references: { modelName: 'MedicalClaim', key: 'ClaimNo' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  StaffID: { type: Sequelize.INTEGER.UNSIGNED, references: { modelName: 'Staff', key: 'ID' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  PolicyNo: { type: Sequelize.STRING, allowNull: true, references: { modelName: 'HealthPolicy', key: 'PolicyNo' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
  AssignedForDate: { type: Sequelize.DATE },
  CreatedDate: { type: Sequelize.DATE },
  UpdatedDate: { type: Sequelize.DATE }
}, {
  sequelize: db,
  modelName: 'ClaimStaff',
  tableName: 'ClaimStaff',
  timestamps: true,
  createdAt: 'CreatedDate',
  updatedAt: 'UpdatedDate'
})

module.exports = ClaimStaff