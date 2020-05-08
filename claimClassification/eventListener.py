import asyncio
from aio_pika import connect, IncomingMessage
from config.config import *
import requests
import sys

async def on_message(message: IncomingMessage):
    sys.stdout.write("message received")
    sys.stdout.flush()
    try:
        sys.stdout.write("sending to http://127.0.0.1:%s/handle-event\n" % (PORT))
        sys.stdout.flush()
        requests.post("http://127.0.0.1:%s/handle-event" % (PORT), json = { 'event': message.routing_key, 'body': message.body.decode(encoding="utf-8") })
        sys.stdout.write("sent. acknowledging message.\n")
        sys.stdout.flush()
        await message.ack()
    except:
        sys.stdout.write("Unexpected error:\n", sys.exc_info()[0])
        sys.stdout.flush()
        sys.stdout.write("Sending to http server failed\n")
        sys.stdout.flush()

async def main(loop):
    # Perform connection
    connected = False
    while not connected:
        try:
            connection = await connect(EVENT_DISPATCHER_HOST, loop=loop)
            connected = True
            sys.stdout.write("AMPQ connected\n")
            sys.stdout.flush()
        except ConnectionError:
            sys.stdout.write("---------------\n")
            sys.stdout.write("Error connecting to ampq server\n")
            sys.stdout.write("retrying in 5 secs...\n")
            sys.stdout.flush()
            await asyncio.sleep(5)
        except:
            sys.stdout.write("---------------\n")
            sys.stdout.write("Unexpected error:", sys.exc_info()[0])
            sys.stdout.write("\nretrying in 5 secs...\n")
            await asyncio.sleep(5)
    
    
    # Creating a channel
    channel = await connection.channel()
    # Declaring queue
    queue = await channel.declare_queue("NEW_CLAIM_SUBMITTED", durable=True)
    sys.stdout.write("Ready for events\n")
    sys.stdout.flush()
    # Start listening the queue with name 'hello'
    await queue.consume(on_message)


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.create_task(main(loop))

    # we enter a never-ending loop that waits for data and
    # runs callbacks whenever necessary.
    loop.run_forever()