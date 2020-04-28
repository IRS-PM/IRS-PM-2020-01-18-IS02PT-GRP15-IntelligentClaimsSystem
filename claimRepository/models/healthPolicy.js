const Sequelize = require('sequelize')
const { db } = require('../db/mysql.js')
const { formatDateForClassification } = require('../utils/date') 

class HealthPolicy extends Sequelize.Model {}

HealthPolicy.init({
  PolicyNo: { type: Sequelize.STRING, primaryKey: true },
  PolicyHolderID: { type: Sequelize.STRING },
  PolicyHolderName: { type: Sequelize.STRING },
  InsuredID: { type: Sequelize.STRING },
  InsuredName: { type: Sequelize.STRING },
  InsuredDOB: { type: Sequelize.DATEONLY },
  InsuredDOBFormatted: { type: Sequelize.VIRTUAL, get() { return formatDateForClassification(this.getDataValue('InsuredDOBFormatted')) } },
  PXIllness: { type: Sequelize.STRING },
  Status: { type: Sequelize.INTEGER(1).UNSIGNED }, // 1 = Inforce, 2 = Terminated
  EffectiveDate: { type: Sequelize.DATE },
  EffectiveDateFormatted: { type: Sequelize.VIRTUAL, get() { return formatDateForClassification(this.getDataValue('EffectiveDate')) } },
  ExpiryDate: { type: Sequelize.DATE },
  ExpiryDateFormatted: { type: Sequelize.VIRTUAL, get() { return formatDateForClassification(this.getDataValue('ExpiryDateFormatted')) } },
  PremiumAmount: { type: Sequelize.FLOAT(10, 2), allowNull: false, defaultValue: 0 },
  RiderPremiumAmount: { type: Sequelize.FLOAT(10, 2), allowNull: false, defaultValue: 0 },
  OutstandingPremium: { type: Sequelize.FLOAT(10, 2), allowNull: false, defaultValue: 0 },
  RiderOutstandingPremium: { type: Sequelize.FLOAT(10, 2), allowNull: false, defaultValue: 0 },
  ProductCode: { 
    type: Sequelize.STRING, 
    references: {
      modelName: 'ProductPlan',
      key: 'ProductCode'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  EntryDate: { type: Sequelize.DATE },
  EntryDateFormatted: { type: Sequelize.VIRTUAL, get() { return formatDateForClassification(this.getDataValue('EntryDate')) } },
  CommencementDate: { type: Sequelize.DATE },
  CommencementDateFormatted: { type: Sequelize.VIRTUAL, get() { return formatDateForClassification(this.getDataValue('CommencementDate')) } },
  ReinstatementDate: { type: Sequelize.DATE },
  ReinstatementDateFormatted: { type: Sequelize.VIRTUAL, get() { return formatDateForClassification(this.getDataValue('ReinstatementDate')) } },
  RiderEntryDate: { type: Sequelize.DATE },
  RiderEntryDateFormatted: { type: Sequelize.VIRTUAL, get() { return formatDateForClassification(this.getDataValue('RiderEntryDate')) } },
  Rider: { type: Sequelize.ENUM('Y', 'N'), allowNull: false, defaultValue: 'N' },
  RiderPrdtCode: { 
    type: Sequelize.STRING, 
    references: {
      modelName: 'ProductPlan',
      key: 'ProductCode'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    defaultValue: null
  },
  RiderCommencementDate: { type: Sequelize.DATE },
  RiderCommencementDateFormatted: { type: Sequelize.VIRTUAL, get() { return formatDateForClassification(this.getDataValue('RiderCommencementDate')) } },
  RiderReinstatementDate: { type: Sequelize.DATE },
  RiderReinstatementDateFormatted: { type: Sequelize.VIRTUAL, get() { return formatDateForClassification(this.getDataValue('RiderReinstatementDate')) } },
  AllowAutoClaim: { type: Sequelize.ENUM('Y', 'N'), allowNull: false, defaultValue: 'Y' },
  PolicyYearLimit: { type: Sequelize.FLOAT(10, 2), allowNull: false, defaultValue: 0 },
  PolicyYearBalance: { type: Sequelize.FLOAT(10, 2), allowNull: false, defaultValue: 0 },
  LifeTimeLimit: { type: Sequelize.FLOAT(10, 2), allowNull: false, defaultValue: 0 },
  LifeTimeBalance: { type: Sequelize.FLOAT(10, 2), allowNull: false, defaultValue: 0 }
}, {
  sequelize: db,
  modelName: 'HealthPolicy',
  tableName: 'HealthPolicy',
  timestamps: false
})

module.exports = HealthPolicy