import asyncio
import websockets
import socket

port = 8080

async def listen(ws_server,urlpath):
    urlpath = urlpath[1:]
    url = urlpath
    
    if urlpath.startswith("wss:/") and not urlpath.startswith("wss://"):
        url = urlpath.replace("wss:/", "wss://")
    elif urlpath.startswith("ws:/") and not urlpath.startswith("ws://"):
        url = urlpath.replace("ws:/", "ws://")
    else:
        url = "ws://localhost:9022"
    
    print("connect to server" , url)

    async with websockets.connect(url) as ws_client:
        async def forward_messages(ws_from, ws_to):
            async for msg in ws_from:
                await ws_to.send(msg)

        await asyncio.gather(
            forward_messages(ws_server, ws_client),
            forward_messages(ws_client, ws_server)
        )

    return ws_server

async def main():

    print("Websocket manager start port:",port)
    async with websockets.serve(listen, "0.0.0.0", port,ping_interval=5000,ping_timeout=5000) as s:
        for sock in s.server.sockets:
            sock.setsockopt(socket.SOL_SOCKET,socket.SO_REUSEADDR,1)
        await asyncio.Future()



if __name__ == '__main__':
    asyncio.run(main())

