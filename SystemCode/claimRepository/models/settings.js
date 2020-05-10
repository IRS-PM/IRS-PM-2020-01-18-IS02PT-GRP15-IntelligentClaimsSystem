const Sequelize = require('sequelize')
const { db } = require('../db/mysql.js')

class Settings extends Sequelize.Model {}

Settings.init({
  ID: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  LastSchedulerRunTime: { type: Sequelize.DATE, allowNull: true, defaultValue: null }
}, {
  sequelize: db,
  modelName: 'Settings',
  tableName: 'Settings',
  timestamps: false
})

module.exports = Settings