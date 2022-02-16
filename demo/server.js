const express = require('express');//引入express模块
const webSocket = require('ws');//引入ws服务器模块
const app = express();
const ws = new webSocket.Server({ port: 8000 });//创建服务器,端口为8000

app.use("/", express.static("./client"));

let clients = {}
let clientNum = 0
ws.on('connection', (client) => {//连接客户端
     client.name = ++clientNum;
     clients[client.name] = client;

     // 用户的聊天信息
     client.on('message', (msg) => {
          var s = JSON.parse(msg)
          client.s = s;
          clients[client.name].s = s
          console.log(s.name + "说:" + s.value)
          if (s.obj) {
               for (var key in clients) {
                    if (clients[key].s.name == s.name) {
                         clients[key].send(msg);
                    } else if (clients[key].s.name == s.obj) {
                         clients[key].send(msg);
                    }
               }
          } else {
               for (var key in clients) {
                    clients[key].send(msg)
               }
          }

     })
     //报错信息
     client.on('error', (err => {
          if (err) {
               console.log(err)
          }
     }))
     // 关闭连接
     client.on('close', () => {
          delete clients[client.name];
          console.log(client.s.name + "下线了")
     })
     //检测是否连通
     setInterval(() => {
          if (!client) return;
          if (client.readyState == 3)return;
          client.ping()
     }, 3000)
     client.on('ping', () => {
          console.log(client.s.name+"ping");
     })
     client.on('pong', () => {
          console.log(client.s.name+"pong");
     })

})

app.listen(9999, () => {
     console.log('端口已启用')
})