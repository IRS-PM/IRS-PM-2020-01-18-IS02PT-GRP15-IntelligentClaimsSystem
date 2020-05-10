const Sequelize = require('sequelize')
const { db } = require('../db/mysql.js')

class Hospital extends Sequelize.Model {}

Hospital.init({
  HospitalCode: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
  HospitalName: { type: Sequelize.STRING },
  HospitalType: { type: Sequelize.ENUM('1', '0'), defaultValue: '1' } // public or private
}, {
  sequelize: db,
  modelName: 'Hospital',
  tableName: 'Hospital',
  timestamps: false
})

module.exports = Hospital