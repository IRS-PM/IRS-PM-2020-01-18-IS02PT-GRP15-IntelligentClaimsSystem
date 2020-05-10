const Sequelize = require('sequelize')
const { db } = require('../db/mysql.js')

class DiagnosisCode extends Sequelize.Model {}

DiagnosisCode.init({
  DiagnosisCode: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
  Description: { type: Sequelize.TEXT },
  AutoReject: { type: Sequelize.ENUM('Y', 'N'), defaultValue: null, allowNull: true },
  ICDType: { type: Sequelize.INTEGER },
  MinorClaims: { type: Sequelize.ENUM('Y', 'N'), defaultValue: null, allowNull: true }
}, {
  sequelize: db,
  modelName: 'DiagnosisCode',
  tableName: 'DiagnosisCode',
  timestamps: false
})

module.exports = DiagnosisCode