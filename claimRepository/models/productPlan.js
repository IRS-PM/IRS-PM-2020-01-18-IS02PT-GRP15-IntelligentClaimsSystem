const Sequelize = require('sequelize')
const { db } = require('../db/mysql.js')

class ProductPlan extends Sequelize.Model {}

ProductPlan.init({
  ProductCode: { type: Sequelize.STRING, primaryKey: true },
  Description: { type: Sequelize.TEXT },
  ProductClass: { type: Sequelize.STRING },
  ShortDesc: { type: Sequelize.STRING },
  ProductGroup: { type: Sequelize.INTEGER }
}, {
  sequelize: db,
  modelName: 'ProductPlan',
  tableName: 'ProductPlan',
  timestamps: false
})

module.exports = ProductPlan