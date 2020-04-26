'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    const result = await queryInterface.sequelize.query("SELECT count(*) as count FROM `HealthPolicy`")
    if (result[0][0].count > 0) {
      console.log('Already seeded before. Skipping.')
      return Promise.resolve()
    }

    const today = new Date()
    const policies = (Array(500).fill()).map((val, index) => {
      const icNum = `S${Math.round(Math.random() * 9999999).toString().padStart(7, '0')}${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.substr(Math.round(Math.random() * 25), 1)}`
      const hasRider = Math.random() > 0.5
      return {
        PolicyNo: `2020` + index.toString().padStart(5, '0'),
        PolicyHolderId: icNum,
        InsuredId: icNum,
        Status: 1,
        EffectiveDate: new Date(today - Math.round(Math.random() * 10 * 365 * 60 * 60 * 24)),
        ExpiryDate: new Date(today + Math.round(Math.random() * 10 * 365 * 60 * 60 * 24)),
        PremiumAmount: (Math.random() * 5000 + 500),
        OutstandingPremium: Math.random() > 0.5 ? 0 : (Math.random() * 5000 + 500),
        ProductCode: Math.random().toString(36).substr(2),
        CommencementDate: new Date(today - Math.round(Math.random() * 10 * 365 * 60 * 60 * 24)),
        EntryDate: new Date(today - Math.round(Math.random() * 10 * 365 * 60 * 60 * 24)),
        ReinstatementDate: Math.random() > 0.5? null : new Date(today - Math.round(Math.random() * 10 * 365 * 60 * 60 * 24)),
        RiderEntryDate: !hasRider? null : new Date(today - Math.round(Math.random() * 10 * 365 * 60 * 60 * 24)),
        RiderCommencementDate: !hasRider? null : new Date(today - Math.round(Math.random() * 10 * 365 * 60 * 60 * 24)),
        RiderReinstatementDate: !hasRider? null : new Date(today - Math.round(Math.random() * 10 * 365 * 60 * 60 * 24))
      }
    })

    return queryInterface.bulkInsert('HealthPolicy', policies)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('HealthPolicy', {}, {
    })
  }
};
