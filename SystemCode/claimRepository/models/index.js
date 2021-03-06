const ProductPlan = require('./productPlan')
const HealthPolicy = require('./healthPolicy')
const PolicyBenefit = require('./policyBenefit')
const Hospital = require('./hospital')
const DiagnosisCode = require('./diagnosisCode')
const MedicalPanel = require('./medicalPanel')
const MedicalClaim = require('./medicalClaim')
const ClaimItem = require('./claimItem')
const Staff = require('./staff')
const LeaveSchedule = require('./leaveSchedule')
const ClaimStaff = require('./claimStaff')
const Settings = require('./settings')

ProductPlan.hasMany(PolicyBenefit, {
  foreignKey: 'ProductCode'
})
PolicyBenefit.belongsTo(ProductPlan, {
  foreignKey: 'ProductCode'
})

ProductPlan.hasMany(HealthPolicy, {
  foreignKey: 'ProductCode'
})
HealthPolicy.belongsTo(ProductPlan, {
  foreignKey: 'ProductCode'
})

ProductPlan.hasMany(HealthPolicy, {
  foreignKey: 'RiderPrdtCode',
  as: 'Riders'
})
HealthPolicy.belongsTo(ProductPlan, {
  foreignKey: 'RiderPrdtCode',
  as: 'RiderPlan'
})

Staff.hasMany(LeaveSchedule, {
  foreignKey: 'StaffID'
})
LeaveSchedule.belongsTo(Staff, {
  foreignKey: 'StaffID'
})

Staff.hasMany(ClaimStaff, {
  foreignKey: 'StaffID'
})
ClaimStaff.belongsTo(Staff, {
  foreignKey: 'StaffID'
})

MedicalClaim.hasOne(ClaimStaff, {
  foreignKey: 'ClaimNo'
})
ClaimStaff.belongsTo(MedicalClaim, {
  foreignKey: 'ClaimNo'
})

MedicalClaim.hasOne(MedicalPanel, {
  foreignKey: 'RegistrationNo',
  sourceKey: 'Specialist'
})

MedicalClaim.hasMany(ClaimItem, {
  foreignKey: 'ClaimNo'
})
ClaimItem.belongsTo(MedicalClaim, {
  foreignKey: 'ClaimNo'
})

ClaimItem.belongsTo(PolicyBenefit, {
  foreignKey: 'BenefitCode'
})
PolicyBenefit.hasOne(ClaimItem, {
  foreignKey: 'BenefitCode'
})

MedicalClaim.belongsTo(HealthPolicy, {
  foreignKey: 'PolicyNo'
})
HealthPolicy.hasMany(MedicalClaim, {
  foreignKey: 'PolicyNo'
})

module.exports = {
  ProductPlan,
  HealthPolicy,
  PolicyBenefit,
  Hospital,
  DiagnosisCode,
  MedicalPanel,
  MedicalClaim,
  ClaimItem,
  Staff,
  LeaveSchedule,
  ClaimStaff,
  Settings
}