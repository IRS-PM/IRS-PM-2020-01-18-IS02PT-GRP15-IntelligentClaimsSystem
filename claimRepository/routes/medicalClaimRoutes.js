const express = require('express')
const { MedicalClaim, HealthPolicy } = require('../models')
const { NEW_CLAIM_SUBMITTED } = require('../eventDispatcher/events')
const { dispatchEvent } = require('../eventDispatcher/amqp')
const router = express.Router()

router.get(['/', '/classificationstatus/:classificationStatus'], async (req, res) => {
  try {
    const { classificationStatus = '' } = req.params
    const { offset=0, limit=50 } = req.query
    const whereClause = classificationStatus? {
      classificationStatus: classificationStatus
    } : {}

    const claims = await MedicalClaim.findAll({
      where: whereClause,
      offset: parseInt(offset),
      limit: parseInt(limit)
    })
    return res.json({
      total: await MedicalClaim.count({
        where: whereClause
      }),
      offset: offset,
      limit: limit,
      data: claims
    })
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
    const {
      PolicyNo = '',
      DateOcc = new Date(),
      PolicyType = '',
      EffDate = new Date(),
      ExpDate = null,
      CreatedBy = '',
      Rider = '',
      HospitalType = '',
      Specialist = null,
      Specialty = null,
      DiagnosisCode = null,
      ProductCode = null,
      TotalISPays = 0,
      HRN = null,
      SubType = null,
      BillCategory = null,
      FinalPayout = 0,
      HospitalCode = null,
      RiderPrdtCode = null,
      RiderEffDate = null,
      OtherDiagnosis = null,
      RiderTypeID = null,
      PanelTypeID = null,
      TotalExp = null,
      Officer = null
    } = req.body

    // validation
    if (!await HealthPolicy.findByPk(PolicyNo)) {
      res.status(400)
      return res.json({
        errors: 'Invalid policy number'
      })
    }

    const claim = new MedicalClaim({
      PolicyNo, DateOcc, PolicyType, EffDate, ExpDate, CreatedBy, Rider,
      HospitalType, Specialist, Specialty, DiagnosisCode, ProductCode, TotalISPays,
      HRN, SubType, BillCategory, FinalPayout, HospitalCode, RiderPrdtCode, RiderEffDate,
      OtherDiagnosis, RiderTypeID, PanelTypeID, TotalExp, Officer
    })

    await claim.save()
    claim.reload()

    dispatchEvent(NEW_CLAIM_SUBMITTED, JSON.stringify({
      ClaimNo: claim.claimNo
    }))

    return res.json(claim)
  } catch (e) {
    console.error(e)
    res.status(500)
    return res.send('An unexpected error occurred')
  }  
})

router.patch('/:claimNo', async (req, res) => {
  try {
    const { claimNo } = req.params
    const claim = await MedicalClaim.findByPk(claimNo)

    if (!claim) {
      res.status(404)
      return res.send('Not found')
    }

    Object.keys(req.body).forEach(attr => {
      claim.set(attr, req.body[attr])
    })

    await claim.save()
    await claim.reload()
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