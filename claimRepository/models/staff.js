const Sequelize = require('sequelize')
const { db } = require('../db/mysql.js')

class Staff extends Sequelize.Model {}

Staff.init({
  ID: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  Name: { type: Sequelize.STRING },
  Pool1: { type: Sequelize.INTEGER.UNSIGNED },
  Pool2: { type: Sequelize.INTEGER.UNSIGNED }
}, {
  sequelize: db,
  modelName: 'Staff',
  tableName: 'Staff',
  timestamps: false
})

module.exports = Staff