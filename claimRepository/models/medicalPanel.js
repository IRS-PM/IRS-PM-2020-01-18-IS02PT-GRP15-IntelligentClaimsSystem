const Sequelize = require('sequelize')
const { db } = require('../db/mysql.js')

class MedicalPanel extends Sequelize.Model {}

MedicalPanel.init({
  PanelID: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  PanelType: { type: Sequelize.INTEGER(1).UNSIGNED, defaultValue: 1 },
  SpecialistName: { type: Sequelize.STRING },
  RegistrationNo: { type: Sequelize.STRING },
  Specialty: { type: Sequelize.STRING },
  BlacklistReasonID: { type: Sequelize.INTEGER, allowNull: true, defaultValue: null },
  BlacklistPeriodFrom: { type: Sequelize.DATE, allowNull: true, defaultValue: null },
  BlacklistPeriodUntil: { type: Sequelize.DATE, allowNull: true, defaultValue: null }
}, {
  sequelize: db,
  modelName: 'MedicalPanel',
  tableName: 'MedicalPanel',
  timestamps: false
})

module.exports = MedicalPanel