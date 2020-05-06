import asyncio
from aio_pika import connect, IncomingMessage
from config.config import *
import requests
import sys

async def on_message(message: IncomingMessage):
    try:
        print("sending to http://127.0.0.1:%s/handle-event" % (PORT))
        requests.post("http://127.0.0.1:%s/handle-event" % (PORT), json = { 'event': message.routing_key, 'body': message.body.decode(encoding="utf-8") })
        await message.ack()
    except:
        print("Unexpected error:", sys.exc_info()[0])
        print("Sending to http server failed")

async def main(loop):
    # Perform connection
    connected = False
    while not connected:
        try:
            connection = await connect(EVENT_DISPATCHER_HOST, loop=loop)
            connected = True
        except ConnectionError:
            print("---------------")
            print("Error connecting to ampq server")
            print("retrying in 5 secs...")
            await asyncio.sleep(5)
        except:
            print("---------------")
            print("Unexpected error:", sys.exc_info()[0])
            print("retrying in 5 secs...")
            await asyncio.sleep(5)
    
    
    # Creating a channel
    channel = await connection.channel()
    # Declaring queue
    queue = await channel.declare_queue("NEW_CLAIM_SUBMITTED", durable=True)
    print(" [*] Waiting for messages. To exit press CTRL+C")
    # Start listening the queue with name 'hello'
    await queue.consume(on_message)


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.create_task(main(loop))

    # we enter a never-ending loop that waits for data and
    # runs callbacks whenever necessary.
    loop.run_forever()