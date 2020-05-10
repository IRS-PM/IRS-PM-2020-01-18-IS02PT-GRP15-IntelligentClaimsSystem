const { router: productPlanRoutes } = require('./productPlanRoutes')
const { router: medicalPanelRoutes } = require('./medicalPanelRoutes')
const { router: medicalClaimRoutes } = require('./medicalClaimRoutes')
const { router: healthPolicyRoutes } = require('./healthPolicyRoutes')
const { router: staffRoutes } = require('./staffRoutes')
const { router: diagnosisCodeRoutes } = require('./diagnosisCodeRoutes')
const { router: hospitalRoutes } = require('./hospitalRoutes')
const { router: settingsRoutes } = require('./settingsRoutes')

module.exports = {
  productPlanRoutes,
  medicalPanelRoutes,
  medicalClaimRoutes,
  healthPolicyRoutes,
  staffRoutes,
  diagnosisCodeRoutes,
  hospitalRoutes,
  settingsRoutes
}