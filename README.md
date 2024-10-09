# relayhub
Relay Hub is a Nostr relay forwarding project that allows access to multiple relays through Relay Hub.

step 1、
# pip3 install websocket

step 2、
Modify the paths in relay_hub.conf.

# supervisord -c relay_hub.conf 

step 3、
# config ngnix
```
vim /etc/nginx/sites-enabled/xxx.conf 

add :

map $http_upgrade $connection_upgrade {
        default upgrade;
        ''      close;
}

upstream websocketio {
        server 127.0.0.1:8999;
}

server {
    listen 80;
    server_name relay.xxxx.com ;

    location / {
        proxy_pass http://websocketio;
	    proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_connect_timeout 60s;
            proxy_read_timeout 600s;
    }
}

```

# user example
https://github.com/YakiHonne/yakihonne-web-app/tree/main/Client

modify:
https://github.com/YakiHonne/yakihonne-web-app/blob/main/Client/src/Content/Relays.js

```
var relaysOnPlatform = [
  "wss://nostr-01.yakihonne.com",
  "wss://nostr-02.dorafactory.org",
  "wss://relay.damus.io",
  // "wss://nostr-01.dorafactory.org",
  // "wss://nos.lol",
  // "wss://nostr-pub.wellorder.net",
  // "wss://relay.snort.social",
  //   "wss://relay.snort.social",
  //   "wss://arnostr.permadao.io"
  //   "wss://nostr.nostrelay.org"
];

let hub = "ws://relay.xxxxx.com/";

relaysOnPlatform = relaysOnPlatform.map(relay => hub + relay );


export default relaysOnPlatform;

```
