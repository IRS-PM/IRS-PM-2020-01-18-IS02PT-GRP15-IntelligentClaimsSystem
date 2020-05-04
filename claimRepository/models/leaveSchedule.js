const Sequelize = require('sequelize')
const { db } = require('../db/mysql.js')

class LeaveSchedule extends Sequelize.Model {}

LeaveSchedule.init({
  ID: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  StaffID: { type: Sequelize.INTEGER.UNSIGNED, references: { modelName: 'Staff', key: 'ID' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  StartDateTime: { type: Sequelize.DATE, allowNull: false },
  EndDateTime: { type: Sequelize.DATE, allowNull: false },
  IsAbsent: { type: Sequelize.BOOLEAN, defaultValue: false },
  CreatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
  UpdatedAt: { type: Sequelize.DATE, allowNull: true, defaultValue: null },
  DeletedAt: { type: Sequelize.DATE, allowNull: true, defaultValue: null }
}, {
  sequelize: db,
  modelName: 'LeaveSchedule',
  tableName: 'LeaveSchedule',
  timestamps: true,
  createdAt: 'CreatedAt',
  updatedAt: 'UpdatedAt',
  deletedAt: 'DeletedAt',
  paranoid: true
})

module.exports = LeaveSchedule