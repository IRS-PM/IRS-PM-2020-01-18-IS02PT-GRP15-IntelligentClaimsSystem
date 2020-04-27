const Sequelize = require('sequelize')
const { db } = require('../db/mysql.js')

class LeaveSchedule extends Sequelize.Model {}

LeaveSchedule.init({
  ID: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  StaffID: { type: Sequelize.INTEGER.UNSIGNED, references: { modelName: 'Staff', key: 'ID' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  StartDateTime: { type: Sequelize.DATE, allowNull: false },
  EndDateTime: { type: Sequelize.DATE, allowNull: false },
  IsAbsent: { type: Sequelize.BOOLEAN, defaultValue: false }
}, {
  sequelize: db,
  modelName: 'LeaveSchedule',
  tableName: 'LeaveSchedule',
  timestamps: false
})

module.exports = LeaveSchedule