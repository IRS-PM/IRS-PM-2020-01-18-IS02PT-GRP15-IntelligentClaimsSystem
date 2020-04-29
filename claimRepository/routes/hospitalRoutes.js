const express = require('express')
const { Hospital } = require('../models')
const router = express.Router()

router.get('/', async (req, res) => {
  const { offset=0, limit=50 } = req.query
  try {
    const entries = await Hospital.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit)
    })
    return res.json({
      total: await Hospital.count(),
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
    const entry = await Hospital.findByPk(id)
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