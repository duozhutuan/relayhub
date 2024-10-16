import  http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { parse } from 'url';

const server = http.createServer();
const wss = new WebSocketServer({ server });


wss.on('connection', async (ws,req) => {
    
    const parsedUrl = parse(req.url, true);
    var targetUrl = parsedUrl.pathname.slice(1); 

    if (targetUrl.startsWith('wss:/') && !targetUrl.startsWith('wss://')) {
        targetUrl = targetUrl.replace('wss:/', 'wss://');
    }

    if (targetUrl.startsWith('ws:/') && !targetUrl.startsWith('ws://')) {
        targetUrl = targetUrl.replace('ws:/', 'ws://');
    }


    if (!targetUrl.startsWith('wss://') && !targetUrl.startsWith("ws://")) {
        ws.close(1008, 'Invalid target URL');
        return;
    }

    console.log("client connect ", targetUrl, new Date().toLocaleString());
    let targetWs;
    try {
        targetWs = new WebSocket(targetUrl);
        targetWs.on('error' , (error) =>{
            console.log(error);
        })
    } catch {
        return;
    }
    ws.on('message', (message) => {
          if (Buffer.isBuffer(message)) {
               message = message.toString('utf-8');
          }

            console.log(message)


            const sendWhenReady = () => {
                if (targetWs.readyState === WebSocket.OPEN) {
                    targetWs.send(message);
                } else {
                        //wait 500ms
                    setTimeout(sendWhenReady, 500);
                }
            };

            sendWhenReady();
    });

    targetWs.on('message', (message) => {
          if (Buffer.isBuffer(message)) {
               message = message.toString('utf-8');
          }

          if (ws.readyState === WebSocket.OPEN) {
                console.log(message);
                ws.send(message);
          }
    });
      
    ws.on('close', () => {
            try {
                targetWs.close();
            } catch {
            }
    });

    targetWs.on('close', () => {
            try {
                ws.close();
            } catch {
            }
    });


     
});

server.listen(8080, () => {
    console.log('Server is listening on port 8080');
});

