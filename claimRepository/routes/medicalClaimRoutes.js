const express = require('express')
const { MedicalClaim } = require('../models')
const { NEW_CLAIM_SUBMITTED } = require('../eventDispatcher/events')
const { dispatchEvent } = require('../eventDispatcher/amqp')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const claims = await MedicalClaim.findAll()
    return res.json(claims)
  } catch (e) {
    console.error(e)
    res.status(500)
    return res.send('An unexpected error occurred')
  }  
})

router.get('/:claimNo', async (req, res) => {
  try {
    const { claimNo } = req.params
    const claim = await MedicalClaim.findByPk(claimNo)

    if (!claim) {
      res.status(404)
      return res.send('Not found')
    }

    return res.json(claim)
  } catch (e) {
    console.error(e)
    res.status(500)
    return res.send('An unexpected error occurred')
  }  
})

router.post('/', async (req, res) => {
  try {
    const claim = new MedicalClaim()
    dispatchEvent(NEW_CLAIM_SUBMITTED, JSON.stringify({
      ClaimNo: 'xxx'
    }))
    return res.json(claim)
  } catch (e) {
    console.error(e)
    res.status(500)
    return res.send('An unexpected error occurred')
  }  
})

module.exports = {
  router
}