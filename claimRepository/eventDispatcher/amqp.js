const amqp = require('amqplib')
const { EVENT_DISPATCHER_HOST } = process.env
let eventChannel

async function connect() {  
  try {
    const queueConnection = await amqp.connect(EVENT_DISPATCHER_HOST)
    eventChannel = await queueConnection.createChannel()
    eventChannel.prefetch(1)
  } catch (e) {
    throw e
  }
}

function dispatchEvent(event, dataStr) {
  eventChannel.assertQueue(event)
  return eventChannel.sendToQueue(event, Buffer.from(dataStr))
}

function subscribeToEvent(event, callback) {
  eventChannel.assertQueue(event)
  return eventChannel.consume(event, async (message) => {
    if (message !== null) {
      const success = await callback(message.content.toString())
      if (success) {
        eventChannel.ack(message)
      }
    }
  })
}

module.exports = {
  connect,
  dispatchEvent,
  subscribeToEvent
}