'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ProductPlan', {
      ProductCode: { type: Sequelize.STRING, primaryKey: true },
      Description: { type: Sequelize.TEXT },
      ProductClass: { type: Sequelize.STRING },
      ShortDesc: { type: Sequelize.STRING },
      ProductGroup: { type: Sequelize.INTEGER }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ProductPlan');
  }
};