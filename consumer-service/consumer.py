import sys
import yaml
from Subscriber import Subscriber
from os import environ as env
from dotenv import load_dotenv

def load_config():
    load_dotenv()
    config = {
        'RABBITMQ_URI': env.get('RABBITMQ_URI'),
        'MONGODB_URI': env.get('MONGODB_URI'),
        'DATABASE_NAME': env.get('DATABASE_NAME'),
        'QUEUE_NAME': env.get('QUEUE_NAME'),
        'COLLECTION_NAME': env.get('COLLECTION_NAME'),
    }
    return config
def main():
    config = load_config()
    print(config)
    subscriber = Subscriber(config)
    
    # on control + c, close connection, close connection
    try:
        subscriber.consume()
    except KeyboardInterrupt:
        print('Interrupted, exiting ...')
        subscriber.close_connection()
        sys.exit(0)
    


if __name__ == '__main__':
    main()