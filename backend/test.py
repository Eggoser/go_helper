import asyncio
import websockets
import time
import json


first = [5,"go/game"]
second = [7,"go/game",{"command":"auth","token":"1cfc52aacaba0507e66d74cd878020f071457220","game_id":1076}]
third = [7,"go/game",{"command":"resign","token":"1cfc52aacaba0507e66d74cd878020f071457220","game_id":1076}]


async def hello():
    uri = "ws://172.104.137.176:41239"
    async with websockets.connect(uri) as websocket:
        a = (await websocket.recv())

        await websocket.send(json.dumps(first))
        await websocket.send(json.dumps(second))
        a = (await websocket.recv())
        a = (await websocket.recv())

        await websocket.send(json.dumps(third))
        a = (await websocket.recv())


for i in range(10**7):
    asyncio.get_event_loop().run_until_complete(hello())
    print(i)
