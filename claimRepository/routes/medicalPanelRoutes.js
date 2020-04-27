const express = require('express')
const { MedicalPanel } = require('../models')
const router = express.Router()

router.get('/', async (req, res) => {
  const { offset=0, limit=50 } = req.query
  try {
    const entries = await MedicalPanel.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit)
    })
    return res.json({
      total: await MedicalPanel.count(),
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

router.get('/:panelId', async (req, res) => {
  const { panelId } = req.params
  try {
    const entry = await MedicalPanel.findByPk(panelId)
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