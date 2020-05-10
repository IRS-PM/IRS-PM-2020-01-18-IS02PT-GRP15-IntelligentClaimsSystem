const express = require('express')
const { ProductPlan, PolicyBenefit } = require('../models')
const router = express.Router()

router.get('/', async (req, res) => {
  const { offset=0, limit=50 } = req.query
  try {
    const entries = await ProductPlan.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: PolicyBenefit
    })
    return res.json({
      total: await ProductPlan.count(),
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

router.get('/:productCode', async (req, res) => {
  const { productCode } = req.params
  try {
    const entry = await ProductPlan.findByPk(productCode, {include: PolicyBenefit})
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