const Sequelize = require('sequelize')
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env

const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false
})

function connect() {  
  return db.authenticate()
}

module.exports = {
  db, connect
}