'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('MedicalClaim', {
      ClaimNo: { type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      PolicyNo: { 
        type: Sequelize.STRING, 
        references: { 
          model: {
            tableName: 'HealthPolicy'
          },
          key: 'PolicyNo'
        }
      },
      DateOcc: { type: Sequelize.DATE },
      PolicyType: { type: Sequelize.STRING },
      EffDate: { type: Sequelize.DATE },
      ExpDate: { type: Sequelize.DATE },
      CreatedBy: { type: Sequelize.STRING },
      Rider: { type: Sequelize.STRING },
      HospitalType: { type: Sequelize.STRING },
      Specialist: { type: Sequelize.STRING },
      Specialty: { type: Sequelize.STRING },
      DiagnosisCode: { type: Sequelize.STRING },
      ProductCode: { type: Sequelize.STRING },
      TotalISPays: { type: Sequelize.FLOAT(10, 2) },
      HRN: { type: Sequelize.STRING },
      SubType: { type: Sequelize.STRING },
      BillCategory: { type: Sequelize.STRING },
      FinalPayout: { type: Sequelize.FLOAT(10, 2) },
      HospitalCode: { type: Sequelize.STRING },
      RiderPrdtCode: { type: Sequelize.STRING },
      RiderEffDate: { type: Sequelize.DATE },
      OtherDiagnosis: { type: Sequelize.STRING },
      RiderTypeID: { type: Sequelize.INTEGER.UNSIGNED },
      PanelTypeID: { type: Sequelize.INTEGER.UNSIGNED },
      TotalExp: { type: Sequelize.FLOAT(10, 2) }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('MedicalClaim');
  }
};