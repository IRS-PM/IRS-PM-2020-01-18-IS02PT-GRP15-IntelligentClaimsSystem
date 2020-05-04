'use strict';
const fs = require('fs-extra')
const csv = require('csvtojson')
const moment = require('moment')
const {ProductPlan, DiagnosisCode, PolicyBenefit, MedicalPanel, Staff, HealthPolicy, Hospital, MedicalClaim, ClaimItem } = require('../models')

const steps = [
  {
    tableName: 'ProductPlan',
    csvLocation: `${__dirname}/data/productPlans.csv`,
    model: ProductPlan,
    idColumn: 'ProductCode',
    deleteOtherRows: true
  },
  {
    tableName: 'PolicyBenefit',
    csvLocation: `${__dirname}/data/policyBenefit.csv`,
    model: PolicyBenefit,
    idColumn: 'BenefitCode',
    deleteOtherRows: true
  },
  {
    tableName: 'DiagnosisCode',
    csvLocation: `${__dirname}/data/diagnosisCode.csv`,
    model: DiagnosisCode,
    idColumn: 'DiagnosisCode',
    deleteOtherRows: true
  },
  {
    tableName: 'MedicalPanel',
    csvLocation: `${__dirname}/data/medicalPanel.csv`,
    model: MedicalPanel,
    idColumn: 'PanelID',
    deleteOtherRows: true,
    transformData: (data) => {
      return {
        ...data,
        BlacklistReasonID: data['BlacklistReasonID'] || null,
        BlacklistPeriodFrom: data['BlacklistPeriodFrom']? moment(data['BlacklistPeriodFrom'], "MM/DD/YYYY").toDate() : null,
        BlacklistPeriodUntil: data['BlacklistPeriodUntil']? moment(data['BlacklistPeriodUntil'], "MM/DD/YYYY").toDate() : null
      }
    }
  },
  {
    tableName: 'Staff',
    csvLocation: `${__dirname}/data/staff.csv`,
    model: Staff,
    idColumn: 'ID',
    deleteOtherRows: false
  },
  {
    tableName: 'HealthPolicy',
    csvLocation: `${__dirname}/data/healthPolicy.csv`,
    model: HealthPolicy,
    idColumn: 'PolicyNo',
    deleteOtherRows: true,
    transformData: (data) => {
      return {
        ...data,
        InsuredDOB: data['InsuredDOB']? moment(data['InsuredDOB'], "MM/DD/YYYY").toDate() : null,
        EffectiveDate: data['EffectiveDate']? moment(data['EffectiveDate'], "MM/DD/YYYY").toDate() : null,
        ExpiryDate: data['ExpiryDate']? moment(data['ExpiryDate'], "MM/DD/YYYY").toDate() : null,
        EntryDate: data['EntryDate']? moment(data['EntryDate'], "MM/DD/YYYY").toDate() : null,
        CommencementDate: data['CommencementDate']? moment(data['CommencementDate'], "MM/DD/YYYY").toDate() : null,
        ReinstatementDate: data['ReinstatementDate']? moment(data['ReinstatementDate'], "MM/DD/YYYY").toDate() : null,
        RiderEntryDate: data['RiderEntryDate']? moment(data['RiderEntryDate'], "MM/DD/YYYY").toDate() : null,
        RiderCommencementDate: data['RiderCommencementDate']? moment(data['RiderCommencementDate'], "MM/DD/YYYY").toDate() : null,
        RiderReinstatementDate: data['RiderReinstatementDate']? moment(data['RiderReinstatementDate'], "MM/DD/YYYY").toDate() : null,
        RiderPrdtCode: data['RiderPrdtCode'] || null,
        PolicyYearLimit: data['PolicyYearLimit'] || null,
        PolicyYearBalance: data['PolicyYearBalance'] || null,
        LifetimeLimit: data['LifetimeLimit'] || null,
        LifetimeBalance: data['LifetimeBalance'] || null,
        ProductCode: data['ProductCode'] || null
      }
    }
  },
  {
    tableName: 'Hospital',
    csvLocation: `${__dirname}/data/hospitals.csv`,
    model: Hospital,
    idColumn: 'HospitalCode',
    deleteOtherRows: true
  },
  {
    tableName: 'MedicalClaim',
    csvLocation: `${__dirname}/data/medicalClaims.csv`,
    model: MedicalClaim,
    idColumn: 'ClaimNo',
    deleteOtherRows: false,
    transformData: (data) => {
      return {
        ...data,
        MainClaimNo: data['MainClaimNo'] || null,
        SubType: data['SubType'] || null,
        PanelTypeID: data['PanelTypeID'] || null,
        AutoClaim: !!data['AutoClaim']? (data['AutoClaim'] === 'Y') : null,
        HospitalCode: data['HospitalCode'] || null,
        RiderPrdtCode: data['RiderPrdtCode'] || null,
        DateOcc: data['DateOcc']? moment(data['DateOcc'], "MM/DD/YYYY").toDate() : null,
        EffDate: data['EffDate']? moment(data['EffDate'], "MM/DD/YYYY").toDate() : null,
        ExpDate: data['ExpDate']? moment(data['ExpDate'], "MM/DD/YYYY").toDate() : null,
        CreatedDate: data['CreatedDate']? moment(data['CreatedDate'], "MM/DD/YYYY").toDate() : null,
        UpdatedDate: data['UpdatedDate']? moment(data['UpdatedDate'], "MM/DD/YYYY").toDate() : null,
        CloseDate: data['CloseDate']? moment(data['CloseDate'], "MM/DD/YYYY").toDate() : null,
        RiderEffDate: data['RiderEffDate']? moment(data['RiderEffDate'], "MM/DD/YYYY").toDate() : null,
        AssignDate: data['RiderEffDate']? moment(data['RiderEffDate'], "MM/DD/YYYY").toDate() : null
      }
    }
  },
  {
    tableName: 'ClaimItem',
    csvLocation: `${__dirname}/data/claimItems.csv`,
    model: ClaimItem,
    idColumn: 'ID',
    deleteOtherRows: false
  }
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    for (let i=0; i<steps.length; i++) {
      const { tableName, csvLocation, idColumn, model, transformData=null } = steps[i]

      const ids = []

      try {
        const entries = await csv().fromFile(csvLocation)
        console.log(`Seeding ${entries.length} rows into ${tableName}`)
        await Promise.all(entries.map(entry => {
          ids.push(entry[idColumn])
          const transformedEntry = transformData? transformData(entry) : entry
          return queryInterface.upsert(
            tableName, 
            transformedEntry, 
            transformedEntry,
            { [idColumn]: entry[idColumn] },
            model,
            {}
          )
        }))

        // delete where not in idlist
        await queryInterface.bulkDelete(tableName, {
          [idColumn]: {
            [Sequelize.Op.notIn]: ids
          }
        })

      } catch (e) {
        console.warn(e)
      }
    }
    
    return Promise.resolve()
    // return queryInterface.bulkInsert('HealthPolicy', policies)
  },

  down: async (queryInterface, Sequelize) => {
    for (let i=steps.length-1; i>=0; i--) {
      const { tableName, csvLocation, idColumn, deleteOtherRows } = steps[i]
      try {
        const entries = await csv().fromFile(csvLocation)
        console.log(`Deleting ${entries.length} rows from ${tableName}`)
        const ids = entries.map(entry => entry[idColumn])

        if (deleteOtherRows) {
          await queryInterface.bulkDelete(tableName, {
            [idColumn]: {
              [Sequelize.Op.in]: ids
            }
          }, {})
        }
      } catch (e) {
        console.error(e)
        return Promise.reject(e)
      }
        
    }
    return Promise.resolve()
    // return queryInterface.bulkDelete('HealthPolicy', {}, {
    // })
  }
};
