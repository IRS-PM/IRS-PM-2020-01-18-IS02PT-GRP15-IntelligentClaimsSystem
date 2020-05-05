const Sequelize = require('sequelize')
const { db } = require('../db/mysql.js')
const Moment = require('moment')
const MomentRange = require('moment-range')
const moment = MomentRange.extendMoment(Moment)

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

Staff.prototype.getReportByDate = async function(date) {
  const ClaimStaff = this.sequelize.models.ClaimStaff
  const MedicalClaim = this.sequelize.models.MedicalClaim
  const LeaveSchedule = this.sequelize.models.LeaveSchedule
  const from = moment(date).hours(0).minutes(0).seconds(0).toDate()
  const to = moment(date).hours(23).minutes(59).seconds(59).toDate()
  const claimsWithinDay =  await ClaimStaff.findAll({
    where: {
      StaffID: this.ID,
      AssignedForDate: {
        [Sequelize.Op.gte]: from,
        [Sequelize.Op.lte]: to
      }
    },
    include: {
      model: MedicalClaim,
      attributes: ['PoolID']
    }
  })

  const leaveForDay = await LeaveSchedule.findAll({
    where: {
      StaffID: this.ID,
      StartDateTime: {
        [Sequelize.Op.lte]: to
      },
      EndDateTime: {
        [Sequelize.Op.gte]: from
      }
    }
  })

  const workingDayFrom = moment(date).hours(9).minutes(0).seconds(0).toDate()
  const workingDayTo = moment(date).hours(18).minutes(0).seconds(0).toDate()
  const daysRange = moment.range(workingDayFrom, workingDayTo)
  const absentHours = leaveForDay.reduce((acc, leave) => {
    try {
      const intersection = daysRange.intersect(moment.range(leave.StartDateTime, leave.EndDateTime))
      
      if (intersection) {
        return acc + Math.round(moment.duration(intersection.end.diff(intersection.start)).asHours())
      }
      
    } catch (e) {
      console.error(e)
    }
    
    return acc
  }, 0)
  
  return {
    Date: date,
    AssignedHours: claimsWithinDay.length,
    AbsentHours: absentHours,
    Claims: claimsWithinDay,
    Leave: leaveForDay,
  }
}

Staff.prototype.getLastAssignedClaim = async function(date) {
  const ClaimStaff = this.sequelize.models.ClaimStaff
  const lastClaim =  await ClaimStaff.findOne({
    where: {
      StaffID: this.ID
    },
    order: [['AssignedForDate', 'DESC']]
  })
  return lastClaim
}

module.exports = Staff