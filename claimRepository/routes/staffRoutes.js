const express = require('express')
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

module.exports = {
  router
}