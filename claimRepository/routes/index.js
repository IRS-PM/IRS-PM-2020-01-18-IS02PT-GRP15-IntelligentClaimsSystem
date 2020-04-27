const { router: productPlanRoutes } = require('./productPlanRoutes')
const { router: medicalPanelRoutes } = require('./medicalPanelRoutes')
const { router: medicalClaimRoutes } = require('./medicalClaimRoutes')
const { router: healthPolicyRoutes } = require('./healthPolicyRoutes')
const { router: staffRoutes } = require('./staffRoutes')

module.exports = {
  productPlanRoutes,
  medicalPanelRoutes,
  medicalClaimRoutes,
  healthPolicyRoutes,
  staffRoutes
}