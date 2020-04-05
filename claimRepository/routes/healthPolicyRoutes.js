const express = require('express')
const { HealthPolicy } = require('../models')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const policies = await HealthPolicy.findAll()
    return res.json(policies)
  } catch (e) {
    console.error(e)
    res.status(500)
    return res.send('An unexpected error occurred')
  }  
})

router.post('/', async (req, res) => {
  try {
    const policies = await HealthPolicy.findAll()
    return res.json(policies)
  } catch (e) {
    console.error(e)
    res.status(500)
    return res.send('An unexpected error occurred')
  }  
})

module.exports = {
  router
}