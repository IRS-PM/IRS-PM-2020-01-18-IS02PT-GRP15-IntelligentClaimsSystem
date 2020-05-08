const express = require('express')
const sequelize = require('sequelize')
const { db } = require('../db/mysql')
const { MedicalClaim, HealthPolicy, ClaimStaff, Staff, ClaimItem, ProductPlan, PolicyBenefit, MedicalPanel, DiagnosisCode, Hospital } = require('../models')
const { NEW_CLAIM_SUBMITTED } = require('../eventDispatcher/events')
const { dispatchEvent } = require('../eventDispatcher/amqp')
const router = express.Router()
const moment = require('moment')
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
  model: MedicalPanel
}]

router.get(['/', '/status/:status', '/policyno/:policyNo'], async (req, res) => {
  try {
    const { status = '', policyNo = '' } = req.params
    const { offset=0, limit=20, orderby='CreatedDate', orderseq='DESC', datefrom=null, dateto=null } = req.query
    const whereClause = {}
    if (!!status) whereClause.Status = status
    if (!!policyNo) whereClause.PolicyNo = policyNo
    if (!!datefrom && !!dateto) whereClause.CreatedDate = {
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
    if (!!datefrom && !!dateto) whereClause.CreatedDate = {
      [sequelize.Op.gte]: datefrom,
      [sequelize.Op.lte]: dateto
    }

    const statuses = await MedicalClaim.findAll({
      attributes: ['Status', 'AutoClaim', [sequelize.literal('COUNT(*)'), 'Count']],
      group: ['AutoClaim', 'Status'],
      where: whereClause
    })
    
    return res.json(statuses)

  } catch (e) {
    console.error(e)
    res.status(500)
    return res.send('An unexpected error occurred')
  }  
})

router.get('/autoclaimdistribution', async (req, res) => {
  try {
    const { datefrom=null, dateto=null } = req.query
    const whereClause = {}
    if (!!datefrom && !!dateto) whereClause.CreatedDate = {
      [sequelize.Op.gte]: datefrom,
      [sequelize.Op.lte]: dateto
    }

    const statuses = await MedicalClaim.findAll({
      attributes: ['AutoClaim', [sequelize.literal('COUNT(*)'), 'Count']],
      group: ['AutoClaim'],
      where: whereClause
    })
    
    return res.json(statuses)

  } catch (e) {
    console.error(e)
    res.status(500)
    return res.send('An unexpected error occurred')
  }  
})

router.get('/pendingassignment', async(req, res) => {

  const whereClause = {
    Status: 0,
    AutoClaim: 0
  }

  const claims = await MedicalClaim.findAll({
    where: whereClause,
    order: [
      ['CreatedDate', 'ASC']
    ]
  })

  return res.json({
    total: await MedicalClaim.count({
      where: whereClause
    }),
    data: claims
  })
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
      AutoClaim = null,
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
      claimIds: [claim.ClaimNo]
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

router.post('/assign/:claimNo/to/:staffID', async (req, res) => {
  try {
    const { claimNo, staffID } = req.params
    const { AssignedForDate = new Date() } = req.body
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

    // existing assignment
    const existingAssignment = await ClaimStaff.findOne({
      where: {
        ClaimNo: claim.ClaimNo
      }
    })

    if (existingAssignment) {
      res.status(400)
      return res.send('Claim already assigned')
    }

    // insert claim staff
    const claimStaff = new ClaimStaff({
      StaffID: staff.ID,
      ClaimNo: claim.ClaimNo,
      PolicyNo: claim.PolicyNo,
      AssignedForDate: AssignedForDate
    })

    await claimStaff.save()

    // update claim status
    claim.Status = 1
    await claim.save()

    await claim.reload()
    return res.json(claimStaff)

  } catch (e) {
    console.error(e)
    res.status(500)
    return res.send('An unexpected error occurred')
  }  
})


router.post('/assignstaff', async (req, res) => {
  try {
    const { claimAssignment = null } = req.body
    if (!Array.isArray(claimAssignment)) {
      res.status(400)
      return res.send('claimAssignment needs to be an array')
    }

    const transaction = await db.transaction()
    
    try {

      const allResult = await Promise.all(claimAssignment.map(async (assignment) => {
        const { claimNo, staffId: staffID, assignedForDate } = assignment
        const claim = await MedicalClaim.findByPk(claimNo, {
          include: modelIncludes
        })
  
        if (!claim) {
          throw new Error('Invalid claim')
        }
  
        const staff = await Staff.findByPk(staffID)
  
        if (!staff) {
          throw new Error('Invalid staff')
        }
  
        // existing assignment
        const existingAssignment = await ClaimStaff.findOne({
          where: {
            ClaimNo: claim.ClaimNo
          }
        })
  
        if (existingAssignment) {
          throw new Error(`Claim (claimNo: ${claimNo}) already assigned`)
        }
  
        // insert claim staff
        const claimStaff = new ClaimStaff({
          StaffID: staff.ID,
          ClaimNo: claim.ClaimNo,
          PolicyNo: claim.PolicyNo,
          AssignedForDate: assignedForDate
        })
  
        await claimStaff.save()
  
        // update claim status
        claim.Status = 1
        await claim.save()
        await claim.reload()
  
        return claimStaff
      }))
     
      await transaction.commit()
      return res.json(allResult)
    } catch (e) {
      await transaction.rollback()
      res.status(400)
      return res.send(e.toString())
    }


  } catch (e) {
    console.error(e)
    res.status(500)
    return res.send('An unexpected error occurred')
  }  
})


router.post('/bulk-insert', async (req, res) => {
  let { numToInsert=0 } = req.body

  // max of 300 records
  numToInsert = Math.min(numToInsert, 300)

  // get a list of policies
  const allPolicies = await HealthPolicy.findAll()
  const allMedicalPanels = await MedicalPanel.findAll()
  const allDiagnosis = await DiagnosisCode.findAll({
    where: {
      AutoReject: 'N'
    }
  })
  const allHospitals = await Hospital.findAll()

  const claims = await Promise.all(Array(numToInsert).fill(null).map(async (val, index) => {
    const randPolicy = allPolicies[Math.round(Math.random() * (allPolicies.length - 1))]
    const randMedicalPanel = allMedicalPanels[Math.round(Math.random() * (allMedicalPanels.length - 1))]
    const randDiagnosis = allDiagnosis[Math.round(Math.random() * (allDiagnosis.length - 1))]
    const randHospital = allHospitals[Math.round(Math.random() * (allHospitals.length - 1))]
    const randAmount = Math.round((50 + Math.random() * 15000) * 100) / 100
    const randBillCategory = ['IN','PP','OU','DY'][Math.round(Math.random() * 3)]
    const randHRN = 'H' + Array(8).fill(0).reduce((acc)=> acc + Math.round(Math.random() * 9).toString(), '')
    const randPolicyProduct = await ProductPlan.findOne({ where: { ProductCode: randPolicy.ProductCode } })
    const randBenefit = await PolicyBenefit.findOne({
      where: { 
        ProductCode: randPolicyProduct.ProductCode 
      },
      order: [
        sequelize.literal('rand()')
      ]
    })

    const now = new Date()

    const claim = new MedicalClaim({
      MainClaimNo: null,
      ClaimType: 1,
      PolicyNo: randPolicy.PolicyNo,
      DateOcc: moment().subtract(Math.round(Math.random() * 90), 'days'),
      EffDate: randPolicy.EffectiveDate,
      ExpDate: randPolicy.ExpiryDate,
      Rider: !!randPolicy.RiderPrdtCode? 'Y' : 'N',
      HospitalType: 'S',
      Specialist: randMedicalPanel.RegistrationNo,
      Specialty: randMedicalPanel.Specialty,
      DiagnosisCode: randDiagnosis.DiagnosisCode,
      RefundAmount: randAmount,
      HRN: randHRN,
      SubType: 'FS',
      BillCategory: randBillCategory,
      FinalPayout: 0,
      HospitalCode: randHospital.HospitalCode,
      RiderPrdtCode: randPolicy.RiderPrdtCode,
      RiderEffDate: randPolicy.RiderCommencementDate,
      OtherDiagnosis: '', 
      RiderTypeID: 0,
      PanelTypeID: randMedicalPanel.PanelType,
      TotalExp: randAmount,
      Status: 0,
      ClaimRemark: 'Generated',
      AttachUrl: null,
      PolicyHolderID: randPolicy.PolicyHolderID,
      PolicyHolderName: randPolicy.PolicyHolderName,
      InsuredID: randPolicy.InsuredID,
      InsuredName: randPolicy.InsuredName,
      PoolID: [1, 2, 3, 4][Math.round(Math.random() * 3)],
      PolicyDuration: Math.abs(Math.round(moment(randPolicy.CommencementDate).diff(moment(now)) / 1000 / 60 / 60 / 24)),
      AssignDate: null,
      CloseDate: null,
      AutoClaim: null,
      DeductibleAmount: 0,
      CopayAmount: 0
    })
    await claim.save()
    const claimObj = claim.toJSON()

    // random benefit code from the policy's benefits
    if (!!randBenefit) {
      const claimItem = new ClaimItem({
        ClaimNo: claim.ClaimNo, 
        BenefitCode: randBenefit.BenefitCode, 
        Qty: 1, 
        Amount: randAmount, 
        ReceiptRef: ''
      })
      await claimItem.save()

      claimObj['ClaimItem'] = [claimItem.toJSON()]
    }
    

    return claimObj
  }))

  const claimNos = claims.map(claim => claim.ClaimNo)
  dispatchEvent(NEW_CLAIM_SUBMITTED, JSON.stringify({
    claimIds: claimNos
  }))

  return res.json({
    claims
  })
})

module.exports = {
  router
}