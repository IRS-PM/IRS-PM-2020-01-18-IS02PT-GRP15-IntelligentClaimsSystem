const express = require('express')
const sequelize = require('sequelize')
const { MedicalClaim, HealthPolicy, ClaimStaff, Staff, ClaimItem, ProductPlan, PolicyBenefit } = require('../models')
const { NEW_CLAIM_SUBMITTED } = require('../eventDispatcher/events')
const { dispatchEvent } = require('../eventDispatcher/amqp')
const router = express.Router()
const currentDate = new Date()

const modelIncludes = [{
  model: HealthPolicy,
  include: [{
    model: ProductPlan,
    include: PolicyBenefit
  }, {
    model: MedicalClaim,
    attributes: [
      'ClaimNo', 
      'DateOcc',
      'AutoClaim'
    ]
  }]
}, {
  model: ClaimItem,
  include: PolicyBenefit
}, {
  model: ClaimStaff,
  include: Staff
}]

router.get(['/', '/status/:status', '/policyno/:policyNo'], async (req, res) => {
  try {
    const { status = '', policyNo = '' } = req.params
    const { offset=0, limit=50, orderby='DateOcc', orderseq='DESC', datefrom=null, dateto=null } = req.query
    const whereClause = {}
    if (!!status) whereClause.Status = status
    if (!!policyNo) whereClause.PolicyNo = policyNo
    if (!!datefrom && !!dateto) whereClause.DateOcc = {
      [sequelize.Op.gte]: datefrom,
      [sequelize.Op.lte]: dateto
    }

    const claims = await MedicalClaim.findAll({
      where: whereClause,
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: modelIncludes,
      order: [
        [orderby, orderseq]
      ]
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

router.get('/statusdistribution', async (req, res) => {
  try {
    const { datefrom=null, dateto=null } = req.query
    const whereClause = {}
    if (!!datefrom && !!dateto) whereClause.DateOcc = {
      [sequelize.Op.gte]: datefrom,
      [sequelize.Op.lte]: dateto
    }

    const statuses = await MedicalClaim.findAll({
      attributes: ['Status', [sequelize.literal('COUNT(*)'), 'Count']],
      group: ['Status'],
      where: whereClause
    })
    
    return res.json(statuses)

  } catch (e) {
    console.error(e)
    res.status(500)
    return res.send('An unexpected error occurred')
  }  
})

router.get('/:claimNo', async (req, res) => {
  try {
    const { claimNo } = req.params
    const claim = await MedicalClaim.findByPk(claimNo, {
      include: modelIncludes
    })

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
      MainClaimNo = null,
      ClaimType = '',
      PolicyNo = null,
      DateOcc = new Date(),
      EffDate = new Date(),
      ExpDate = new Date(),
      Rider = null,
      HospitalType = null,
      Specialist = null,
      Specialty = null,
      DiagnosisCode = null,
      RefundAmount = null,
      HRN = null,
      SubType = null, //FS = first submission, AM = amendment, CA=Cancel  
      BillCategory = null, //'IN=Inpatient, PP=PreHospitalization/PostHospitalization OU=Outpatient, DY=DayPatient'
      FinalPayout = 0,
      HospitalCode = null,
      RiderPrdtCode = null,
      RiderEffDate = null,
      OtherDiagnosis = null,
      RiderTypeID = null,
      PanelTypeID = null,
      TotalExp = 0,
      Status = 0, // [note: '1=Pending, 2=Approved, 3=Settled, 4=Rejected, 5=Cancelled']
      ClaimRemark = null,
      AttachUrl = null,
      PolicyHolderID = null,
      PolicyHolderName = null,
      InsuredID = null,
      InsuredName = null,
      PoolID = null,
      PolicyDuration = null,
      AssignDate = null,
      CloseDate = null,
      AutoClaim = 1,
      ClassificationReason = null,
      DeductibleAmount = 0,
      CopayAmount = 0,
      CreatedDate = Date.now(),
      BenefitCode = 'PP', // for claimitem
      ReceiptRef = null // for claimitem
    } = req.body

    // validation
    if (!await HealthPolicy.findByPk(PolicyNo)) {
      res.status(400)
      return res.json({
        errors: 'Invalid policy number'
      })
    }

    const claim = new MedicalClaim({
      MainClaimNo, ClaimType, PolicyNo, DateOcc, EffDate, ExpDate, Rider,
      HospitalType, Specialist, Specialty, DiagnosisCode, RefundAmount,
      HRN, SubType, BillCategory, FinalPayout, HospitalCode, RiderPrdtCode, RiderEffDate,
      OtherDiagnosis, RiderTypeID, PanelTypeID, TotalExp, Status, ClaimRemark, AttachUrl,
      PolicyHolderID, PolicyHolderName, InsuredID, InsuredName, PoolID, PolicyDuration,
      AssignDate, CloseDate, AutoClaim, ClassificationReason, DeductibleAmount, CopayAmount, CreatedDate
    })

    await claim.save()
    claim.reload()

    // injecting items
    if (req.body.ClaimItem){
      for (item of req.body.ClaimItem) { 
        const {
          ClaimNo = claim.ClaimNo,
          BenefitCode = 'PP',
          ItemDesc = null,
          Qty = 0,
          Amount = 0,
          ReceiptRef = null // for claimitem
        } = item
        const claimItem = new ClaimItem({
          ClaimNo, ItemDesc, BenefitCode, Qty, Amount, ReceiptRef
        })
        await claimItem.save()
      }
    }
    else {
      const claimItem = new ClaimItem({
        ClaimNo: claim.ClaimNo, ItemDesc: ClaimRemark, BenefitCode, Qty: 1, Amount: TotalExp, ReceiptRef
      })
      await claimItem.save()
    }

    dispatchEvent(NEW_CLAIM_SUBMITTED, JSON.stringify({
      ClaimNo: claim.ClaimNo
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

router.put('/assign/:claimNo/to/:staffID', async (req, res) => {
  try {
    const { claimNo, staffID } = req.params
    const claim = await MedicalClaim.findByPk(claimNo, {
      include: modelIncludes
    })

    if (!claim) {
      res.status(400)
      return res.send('Invalid claim')
    }

    const staff = await Staff.findByPk(staffID)

    if (!staff) {
      res.status(400)
      return res.send('Invalid staff')
    }

    const existingAssignment = await ClaimStaff.findOne({
      ClaimNo: claim.ClaimNo
    })

    if (existingAssignment) {
      res.status(400)
      return res.send('Claim already assigned')
    }

    const claimStaff = new ClaimStaff({
      StaffID: staff.ID,
      ClaimNo: claim.ClaimNo,
      PolicyNo: claim.PolicyNo
    })

    await claimStaff.save()

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