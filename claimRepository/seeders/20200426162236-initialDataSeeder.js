'use strict';
const fs = require('fs-extra')
const csv = require('csvtojson')
const moment = require('moment')
const {ProductPlan, DiagnosisCode, PolicyBenefit, MedicalPanel, Staff, HealthPolicy} = require('../models')

const steps = [
  {
    tableName: 'ProductPlan',
    csvLocation: `${__dirname}/data/productPlans.csv`,
    model: ProductPlan,
    idColumn: 'ProductCode'
  },
  {
    tableName: 'PolicyBenefit',
    csvLocation: `${__dirname}/data/policyBenefit.csv`,
    model: PolicyBenefit,
    idColumn: 'BenefitCode'
  },
  {
    tableName: 'DiagnosisCode',
    csvLocation: `${__dirname}/data/diagnosisCode.csv`,
    model: DiagnosisCode,
    idColumn: 'DiagnosisCode'
  },
  {
    tableName: 'MedicalPanel',
    csvLocation: `${__dirname}/data/medicalPanel.csv`,
    model: MedicalPanel,
    idColumn: 'PanelID',
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
    idColumn: 'ID'
  },
  {
    tableName: 'HealthPolicy',
    csvLocation: `${__dirname}/data/healthPolicy.csv`,
    model: HealthPolicy,
    idColumn: 'PolicyNo',
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
      }
    }
  },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {

    for (let i=0; i<steps.length; i++) {
      const { tableName, csvLocation, idColumn, model, transformData=null } = steps[i]
      try {
        const entries = await csv().fromFile(csvLocation)
        console.log(`Seeding ${entries.length} rows into ${tableName}`)
        await Promise.all(entries.map(entry => {
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
      } catch (e) {
        console.error(e)
        return Promise.reject(e)
      }
    }
    
    return Promise.resolve()
    // return queryInterface.bulkInsert('HealthPolicy', policies)
  },

  down: async (queryInterface, Sequelize) => {
    for (let i=steps.length-1; i>=0; i--) {
      const { tableName, csvLocation, idColumn, modelSchema } = steps[i]
      try {
        const entries = await csv().fromFile(csvLocation)
        console.log(`Deleting ${entries.length} rows from ${tableName}`)
        const ids = entries.map(entry => entry[idColumn])
        await queryInterface.bulkDelete(tableName, {
          [idColumn]: {
            [Sequelize.Op.in]: ids
          }
        }, {})
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
