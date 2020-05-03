require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { connect: connectToDB } = require('./db/mysql.js')
const { connect: connectToEventQueue, dispatchEvent, subscribeToEvent } = require('./eventDispatcher/amqp')
const { healthPolicyRoutes, medicalPanelRoutes, medicalClaimRoutes, productPlanRoutes, staffRoutes, diagnosisCodeRoutes, hospitalRoutes } = require('./routes/index.js')

const { HTTP_PORT, WAIT_TO_START=0 } = process.env
/**
 * Initialize the app
 */
const init = async () => {

  try {
    // connect to db
    await connectToDB()

    // connect to event queue
    await connectToEventQueue()

    // start http server
    const app = express()
    app.use(express.json())
    app.use(cors())

    app.use('/productplan', productPlanRoutes)
    app.use('/medicalclaim', medicalClaimRoutes)
    app.use('/healthpolicy', healthPolicyRoutes)
    app.use('/medicalpanel', medicalPanelRoutes)
    app.use('/diagnosiscode', diagnosisCodeRoutes)
    app.use('/hospital', hospitalRoutes)
    app.use('/staff', staffRoutes)

    app.listen(HTTP_PORT, () => {
      console.log(`Claims Repository service started on port: ${HTTP_PORT}`)
    })

    subscribeToEvent('NEW_CLAIM_SUBMITTED', (message) => {
      console.log(message)
      return true
    })

  } catch (e) {
    console.error(e)
  }
  
}

setTimeout(()=>{
  init()
}, WAIT_TO_START)