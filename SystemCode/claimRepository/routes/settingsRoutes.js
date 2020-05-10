const express = require('express')
const { Settings } = require('../models')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const settings = await Settings.findOne() || new Settings
    return res.json(settings)
  } catch (e) {
    console.error(e)
    res.status(500)
    return res.send('An unexpected error occurred')
  }  
})

router.patch('/', async (req, res) => {
  try {
    const settings = await Settings.findOne() || new Settings

    Object.keys(req.body).forEach(attr => {
      settings.set(attr, req.body[attr])
    })

    await settings.save()
    await settings.reload()
    return res.json(settings)

  } catch (e) {
    console.error(e)
    res.status(500)
    return res.send('An unexpected error occurred')
  }
})

module.exports = {
  router
}