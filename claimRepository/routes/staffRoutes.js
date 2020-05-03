const express = require('express')
const sequelize = require('sequelize')
const { Staff, LeaveSchedule, ClaimStaff, MedicalClaim } = require('../models')
const router = express.Router()

router.get('/', async (req, res) => {
  const { offset=0, limit=50 } = req.query
  try {
    const entries = await Staff.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: [LeaveSchedule, {
        model: ClaimStaff,
        include: MedicalClaim
      }]
    })
    return res.json({
      total: await Staff.count(),
      offset: offset,
      limit: limit,
      data: entries
    })
  } catch (e) {
    console.error(e)
    res.status(500)
    return res.send('An unexpected error occurred')
  }  
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const entry = await Staff.findByPk(id, {
      include: [LeaveSchedule, {
        model: ClaimStaff,
        include: MedicalClaim
      }]
    })
    if (!entry) {
      res.status(404)
      return res.send('Not found')
    }

    return res.json(entry)
  } catch (e) {
    console.error(e)
    res.status(500)
    return res.send('An unexpected error occurred')
  }  
})

// create leave
router.post('/:staffId/leave', async (req, res) => {
  const { staffId } = req.params
  const { StartDateTime = new Date(), EndDateTime = new Date(), IsAbsent=false } = req.body

  try {
    // validate for overlapping leave
    const existingLeave = await LeaveSchedule.findOne({
      where: {
        StaffID: staffId,
        StartDateTime: {
          [sequelize.Op.lte]: EndDateTime
        },
        EndDateTime: {
          [sequelize.Op.gte]: StartDateTime
        }
      }
    })

    if (existingLeave) {
      res.status(400)
      return res.send(`An overlapping leave already exists (ID: ${existingLeave.ID})`)
    }

    const entry = new LeaveSchedule({
      StaffID: staffId,
      StartDateTime: StartDateTime,
      EndDateTime: EndDateTime,
      IsAbsent: IsAbsent
    })

    await entry.save()

    return res.json(entry)
  } catch (e) {
    console.error(e)
    res.status(500)
    return res.send('An unexpected error occurred')
  }  
})

// update leave
router.put('/:staffId/leave/:leaveId', async (req, res) => {
  const { staffId, leaveId } = req.params
  const { StartDateTime = new Date(), EndDateTime = new Date() } = req.body

  try {
    const entry = await LeaveSchedule.findByPk(leaveId)
    if (!entry) {
      res.status(404)
      return res.send('Not found')
    }

    // validate for overlapping leave
    const existingLeave = await LeaveSchedule.findOne({
      where: {
        StaffID: staffId,
        ID: {
          [sequelize.Op.ne]: leaveId
        },
        StartDateTime: {
          [sequelize.Op.lte]: EndDateTime
        },
        EndDateTime: {
          [sequelize.Op.gte]: StartDateTime
        }
      }
    })

    if (existingLeave) {
      res.status(400)
      return res.send(`An overlapping leave already exists (ID: ${existingLeave.ID})`)
    }

    Object.keys((req.body || {})).forEach(attr => {
      entry.set(attr, req.body[attr])
    })

    await entry.save()

    return res.json(entry)
  } catch (e) {
    console.error(e)
    res.status(500)
    return res.send('An unexpected error occurred')
  }  
})

// delete leave
router.delete('/:staffId/leave/:leaveId', async (req, res) => {
  const { staffId, leaveId } = req.params

  try {
    await LeaveSchedule.destroy({
      where: {
        StaffID: staffId,
        ID: leaveId
      }
    })

    return res.json({
      success: true
    })
  } catch (e) {
    console.error(e)
    res.status(500)
    return res.send('An unexpected error occurred')
  }  
})

module.exports = {
  router
}