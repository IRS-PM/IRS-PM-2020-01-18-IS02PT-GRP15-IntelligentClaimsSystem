'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('MedicalClaim', {
      ClaimNo: { type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      MainClaimNo: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true, references: { model: { tableName: 'MedicalClaim' }, key: 'ClaimNo' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      ClaimType: { type: Sequelize.STRING },
      PolicyNo: { type: Sequelize.STRING, references: { model: { tableName: 'HealthPolicy'}, key: 'PolicyNo' } },
      DateOcc: { type: Sequelize.DATE },
      EffDate: { type: Sequelize.DATE },
      ExpDate: { type: Sequelize.DATE },
      Rider: { type: Sequelize.STRING },
      HospitalType: { type: Sequelize.STRING },
      Specialist: { type: Sequelize.STRING },
      Specialty: { type: Sequelize.STRING },
      DiagnosisCode: { type: Sequelize.STRING },
      RefundAmount: { type: Sequelize.FLOAT(10, 2), defaultValue: 0 },
      HRN: { type: Sequelize.STRING },
      SubType: { type: Sequelize.ENUM('FS', 'AM', 'CA'), defaultValue: 'FS' }, //FS = first submission, AM = amendment, CA=Cancel  
      BillCategory: { type: Sequelize.ENUM('IN', 'PP', 'OU', 'DY'), defaultValue: 'IN' }, //'IN=Inpatient, PP=PreHospitalization/PostHospitalization OU=Outpatient, DY=DayPatient'
      FinalPayout: { type: Sequelize.FLOAT(10, 2), defaultValue: 0 },
      HospitalCode: { type: Sequelize.STRING, references: { model: { tableName: 'Hospital' }, key: 'HospitalCode' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      RiderPrdtCode: { type: Sequelize.STRING },
      RiderEffDate: { type: Sequelize.DATE },
      OtherDiagnosis: { type: Sequelize.STRING },
      RiderTypeID: { type: Sequelize.INTEGER.UNSIGNED },
      PanelTypeID: { type: Sequelize.INTEGER.UNSIGNED },
      TotalExp: { type: Sequelize.FLOAT(10, 2), defaultValue: 0 },
      Status: { type: Sequelize.INTEGER(1).UNSIGNED }, // [note: '1=Pending, 2=Approved, 3=Settled, 4=Rejected, 5=Cancelled']
      ClaimRemark: { type: Sequelize.TEXT, defaultValue: '' },
      AttachUrl: { type: Sequelize.STRING(1000), allowNull: true, default: null },
      PolicyHolderID: { type: Sequelize.STRING },
      PolicyHolderName: { type: Sequelize.STRING },
      InsuredID: { type: Sequelize.STRING },
      InsuredName: { type: Sequelize.STRING },
      PoolID: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true, defaultValue: null },
      PolicyDuration: { type: Sequelize.INTEGER.UNSIGNED },
      AssignDate: { type: Sequelize.DATE, allowNull: true, defaultValue: null },
      CloseDate: { type: Sequelize.DATE, allowNull: true, defaultValue: null },
      AutoClaim: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: 1 },
      ClassificationReason: { type: Sequelize.TEXT, allowNull: true, defaultValue: null },
      DeductibleAmount: { type: Sequelize.FLOAT(10, 2), defaultValue: 0 },
      CopayAmount: { type: Sequelize.FLOAT(10, 2), defaultValue: 0 },
      CreatedDate: { type: Sequelize.DATE },
      UpdatedDate: { type: Sequelize.DATE }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('MedicalClaim');
  }
};