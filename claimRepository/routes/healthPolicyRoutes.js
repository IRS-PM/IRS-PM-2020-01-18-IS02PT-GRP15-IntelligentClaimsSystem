const express = require('express')
const { HealthPolicy, ProductPlan, PolicyBenefit } = require('../models')
const router = express.Router()

router.get('/', async (req, res) => {
  const { offset=0, limit=50 } = req.query
  try {
    const policies = await HealthPolicy.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: {
        model: ProductPlan,
        include: PolicyBenefit
      }
    })
    return res.json({
      total: await HealthPolicy.count(),
      offset: offset,
      limit: limit,
      data: policies
    })
  } catch (e) {
    console.error(e)
    res.status(500)
    return res.send('An unexpected error occurred')
  }  
})

router.get('/:policyNo', async (req, res) => {
  const { policyNo } = req.params
  try {
    const policy = await HealthPolicy.findByPk(policyNo, {
      include: {
        model: ProductPlan,
        include: PolicyBenefit
      }
    })
    if (!policy) {
      res.status(404)
      return res.send('Not found')
    }

    return res.json(policy)
  } catch (e) {
    console.error(e)
    res.status(500)
    return res.send('An unexpected error occurred')
  }  
})

router.get('/byinsuredid/:insuredId', async (req, res) => {
  const { insuredId } = req.params
  try {
    const policy = await HealthPolicy.findOne({
      InsuredID: insuredId,
      include: {
        model: ProductPlan,
        include: PolicyBenefit
      }
    })
    if (!policy) {
      res.status(404)
      return res.send('Not found')
    }

    return res.json(policy)
  } catch (e) {
    console.error(e)
    res.status(500)
    return res.send('An unexpected error occurred')
  }  
})

module.exports = {
  router
}