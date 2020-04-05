import pika
import threading
from config.config import EVENT_DISPATCHER_HOST


class EventDispatcher:
    class __EventDispatcher:
        def __init__(self):
            self.connection = pika.BlockingConnection(pika.ConnectionParameters(EVENT_DISPATCHER_HOST))
            self.channel = self.connection.channel()
            print("Event dispatcher connected!")

        def dispatchEvent(self, event, message):
            self.channel.queue_declare(queue=event, durable=True)
            print ("Sending", event)
            self.channel.basic_publish(exchange='', routing_key=event, body=message)

        def doStartSubscribeEvent(self, event, callback):
            self.channel.queue_declare(queue=event, durable=True)
            print ("Subscribing to", event)
            self.channel.basic_consume(
                queue=event, 
                auto_ack=True, 
                on_message_callback=(lambda ch, method, properties, body: self.handleEventCallback(ch, method, properties, body, callback))
            )
            self.channel.start_consuming()

        def subscribeEvent(self, event, callback):
            thread = threading.Thread(target=lambda: self.doStartSubscribeEvent(event=event, callback=callback))
            thread.start()

        def handleEventCallback(self, ch, method, properties, body, callback):
            print(body)

        def __exit__(self):
            print('EXIT!')

    instance=None
    def __new__(self):
        if not EventDispatcher.instance:
            EventDispatcher.instance = EventDispatcher.__EventDispatcher()
        return EventDispatcher.instance