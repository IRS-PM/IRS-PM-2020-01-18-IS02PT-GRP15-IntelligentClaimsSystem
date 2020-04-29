const express = require('express')
const { DiagnosisCode } = require('../models')
const router = express.Router()

router.get(['/', '/autoreject/:autoReject', '/minorclaims/:minorClaims'], async (req, res) => {
  const { offset=0, limit=50 } = req.query
  const { autoReject = '', minorClaims = '' } = req.params
  const whereClause = {}
  if (!!autoReject) whereClause.AutoReject = autoReject
    if (!!minorClaims) whereClause.MinorClaims = minorClaims

  try {
    const entries = await DiagnosisCode.findAll({
      where: whereClause,
      offset: parseInt(offset),
      limit: parseInt(limit)
    })
    return res.json({
      total: await DiagnosisCode.count({
        where: whereClause
      }),
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
    const entry = await DiagnosisCode.findByPk(id)
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