import re
import os
import ssl
import json
import asyncio
import websockets
import numpy as np
from threading import Thread, Lock
from websockets.server import serve
from dotenv import load_dotenv, find_dotenv

# Load environment variables from nearest dotenv file
load_dotenv(find_dotenv())

# Initialize global variables
WEBSOCKET_PORT = os.getenv('PORT_WEBSOCKET') # e.g. 9902

connected = set()

# Function used to process connections from clients
async def handleInput(websocket):
    
    # Record that this client is connected
    global connected
    connected.add(websocket)
    
    # Process each message that the client sends
    try:
        async for message in websocket:
            # Messages are received in JSON format, e.g., {command: "do_something", data: "data"}
            print(message)
            for client in connected:
                if client != websocket:
                    await client.send(message)

    # Process when the client disconnects            
    except websockets.exceptions.ConnectionClosedError:    
        print('Connection closed')
    finally:
        connected.remove(websocket)

async def main():
    # worker_task = asyncio.create_task(worker('worker-1'))
    async with serve(handleInput, "", WEBSOCKET_PORT):
        print('Running websocket server on port {}...'.format(WEBSOCKET_PORT))
        await asyncio.Future()  # run forever

# Run websocket server until we receive a keyboard interrupt
if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print('\nBye bye...')