const Sequelize = require('sequelize')
const { db } = require('../db/mysql.js')

class HealthPolicy extends Sequelize.Model {}

HealthPolicy.init({
  PolicyNo: { type: Sequelize.STRING, primaryKey: true },
  PolicyHolderId: { type: Sequelize.STRING },
  InsuredId: { type: Sequelize.STRING },
  Status: { type: Sequelize.INTEGER },
  EffectiveDate: { type: Sequelize.DATE },
  ExpiryDate: { type: Sequelize.DATE },
  PremiumAmount: { type: Sequelize.FLOAT(10, 2) },
  OutstandingPremium: { type: Sequelize.FLOAT(10, 2) },
  ProductCode: { type: Sequelize.STRING },
  CommencementDate: { type: Sequelize.DATE },
  EntryDate: { type: Sequelize.DATE },
  ReinstatementDate: { type: Sequelize.DATE },
  RiderEntryDate: { type: Sequelize.DATE },
  RiderCommencementDate: { type: Sequelize.DATE },
  RiderReinstatementDate: { type: Sequelize.DATE }
}, {
  sequelize: db,
  modelName: 'HealthPolicy',
  tableName: 'HealthPolicy',
  timestamps: false
})

module.exports = HealthPolicy