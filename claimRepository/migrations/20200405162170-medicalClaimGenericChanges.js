'use strict';

async function getForeignKeyName(tableName, columnName, queryInterface) {
  let sqlz = queryInterface.sequelize;
  let sql = `
    SELECT CONSTRAINT_NAME
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_NAME = '${tableName}'
      AND COLUMN_NAME = '${columnName}'
  `;

  const result = await sqlz.query(sql, { type: sqlz.QueryTypes.SELECT })
  if (!result || !result[0] || !result[0].CONSTRAINT_NAME) {
    return null;
  }

  return result[0].CONSTRAINT_NAME;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {

    // drop foreign key
    const fkName = await getForeignKeyName('MedicalClaim', 'MainClaimNo', queryInterface)
    if (fkName) {
      const dropFKSQL = queryInterface.QueryGenerator.dropForeignKeyQuery("MedicalClaim", fkName)
      await queryInterface.sequelize.query(dropFKSQL)
    }

    return Promise.all([
      queryInterface.changeColumn(
        'MedicalClaim',
        'PanelTypeID',
        { type: Sequelize.INTEGER }
      ),
      queryInterface.changeColumn(
        'MedicalClaim',
        'BillCategory',
        { type: Sequelize.ENUM('IN', 'PP', 'OU', 'DY', 'IP'), defaultValue: 'IN' }
      ),
      queryInterface.changeColumn(
        'MedicalClaim',
        'MainClaimNo',
        { type: Sequelize.INTEGER.UNSIGNED, allowNull: true },
      )
    ])
  },
  down: (queryInterface, Sequelize) => {
    // don't roll back
    return Promise.resolve()
  }
};