---
title: websocket
date: 2021-10-15 18:38:11
categories: websocket
tags: 
--websocket
--javascrip
---

# 1.websocket介绍

## 1.1.简介

WebSocket 协议在2008年诞生，2011年成为国际标准。所有浏览器都已经支持了。

它的最大特点就是，服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息，是真正的双向平等对话，属于 服务器推送技术 的一种。

- WebSocket使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。

- 在WebSocket API中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。

- 基于TCP的全双工通信协议

  

## 1.2.传统的实时通讯方式

### 1.2.1.Ajax轮询

ajax轮询的原理非常简单，让浏览器隔个几秒就发送一次请求，询问服务器是否有新信息。

### 1.2.2.long poll

long poll其实原理跟 ajax轮询 差不多，都是采用轮询的方式，不过采取的是阻塞模型（一直打电话，没收到就不挂电话），也就是说，客户端发起连接后，如果没消息，就一直不返回Response给客户端。直到有消息才返回，返回完之后，客户端再次建立连接，周而复始。

总结：

```
ajax轮询 需要服务器有很快的处理速度和资源。（速度）
long poll 需要有很高的并发，也就是说同时接待客户的能力。（场地大小）

长连接
在页面里嵌入一个隐蔵iframe，将这个隐蔵iframe的src属性设为对一个长连接的请求或是采用xhr请求，服务器端就能源源不断地往客户端输入数据。
优点：消息即时到达，不发无用请求；管理起来也相对方便。
缺点：服务器维护一个长连接会增加开销，当客户端越来越多的时候，server压力大
实例：Gmail聊天
```



## 1.3.和http协议的关系

- Websocket是跟HTTP平级的OSI Layer7的协议，绝非基于HTTP，只不过为了兼容互联网现状采用了相同的端口，并利用HTTP消息切入Websocket协议。
- Websocket是在TCP上独立设计的全双工，有message概念的通信协议，与HTTP没有任何必然联系。
- WebSocket是HTML5出的协议，也就是说HTTP协议没有变化，或者说没关系，但HTTP是不支持持久连接的（长连接，循环连接的不算）
- Websocket其实是为了兼容现有浏览器的握手规范，也就是说它是HTTP协议上的一种补充

![](websocket\we-http.png)

## 1.4.scoket和webscoket

### 1.4.1.什么是socket

 在网络中的两个应用程序（进程）需要全双工相互通信（全双工即双方可同时向对方发送消息），需要用到的就是socket，它能够提供端对端通信，对于程序员来讲，他只需要在某个应用程序的一端（暂且称之为客户端）创建一个socket实例并且提供它所要连接一端（暂且称之为服务端）的IP地址和端口，而另外一端（服务端）创建另一个socket并绑定本地端口进行监听，然后客户端进行连接服务端，服务端接受连接之后双方建立了一个端对端的TCP连接，在该连接上就可 以双向通讯了，而且一旦建立这个连接之后，通信双方就没有客户端服务端之分了，提供的就是端对端通信了。我们可以采取这种方式构建一个桌面版的im程序，让不同主机上的用户发送消息。从本质上来说，socket并不是一个新的协议，它只是为了便于程序员进行网络编程而对tcp/ip协议族通信机制的一种封装。

### 1.4.2.什么是websocket

websocket是html5规范中的一个部分，它借鉴了socket这种思想，为web应用程序客户端和服务端之间（注意是客户端服务端）提供了一种全双工通信机制。同时，它又是一种新的应用层协议，websocket协议是为了提供web应用程序和服务端全双工通信而专门制定的一种应用层协议，通常它表示为：ws://echo.websocket.org/?encoding=text HTTP/1.1，可以看到除了前面的协议名和http不同之外，它的表示地址就是传统的url地址。

```
websocket具有以下几个方面的优势：
（1）建立在 TCP 协议之上，服务器端的实现比较容易。
（2）与 HTTP 协议有着良好的兼容性。默认端口也是80和443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。
（3）数据格式比较轻量，性能开销小，通信高效。
（4）可以发送文本，也可以发送二进制数据。
（5）没有同源限制，客户端可以与任意服务器通信。
（6）协议标识符是ws（如果加密，则为wss），服务器网址就是 URL。
```

总结：

![](./websocket/xx.jpg)

```
软件通信有七层结构，下三层结构偏向与数据通信，上三层更偏向于数据处理，中间的传输层则是连接上三层与下三层之间的桥梁，每一层都做不同的工作，上层协议依赖与下层协议。基于这个通信结构的概念。

Socket 其实并不是一个协议，是应用层与 TCP/IP 协议族通信的中间软件抽象层，它是一组接口。当两台主机通信时，让 Socket 去组织数据，以符合指定的协议。TCP 连接则更依靠于底层的 IP 协议，IP 协议的连接则依赖于链路层等更低层次。

WebSocket 则是一个典型的应用层协议。

总的来说：Socket 是传输控制层协议，WebSocket 是应用层协议。
```



## 1.5.webscoket的通信原理和机制

正常http的get请求：

![](./websocket/requrie.png)

### 1.5.1.客户端：申请协议升级

WebSocket复用了HTTP的握手通道。具体指的是，客户端通过HTTP请求与WebSocket服务端协商升级协议。协议升级完成后，后续的数据交换则遵照WebSocket的协议。

```
GET / HTTP/1.1
Host: localhost:8080
Origin: http://127.0.0.1:3000
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Version: 13
Sec-WebSocket-Key: w4v7O6xFTi36lq3RNcgctw==
```

```
重点请求首部意义如下：

Connection: Upgrade：表示要升级协议
Upgrade: websocket：表示要升级到websocket协议。
Sec-WebSocket-Version: 13：表示websocket的版本。如果服务端不支持该版本，需要返回一个Sec-WebSocket-Versionheader，里面包含服务端支持的版本号。
Sec-WebSocket-Key：与后面服务端响应首部的Sec-WebSocket-Accept是配套的，提供基本的防护，比如恶意的连接，或者无意的连接。
```

### 1.5.2.服务端：响应协议升级

服务端返回内容如下，状态代码`101`表示协议切换。到此完成协议升级，后续的数据交互都按照新的协议来。

```
HTTP/1.1 101 Switching Protocols
Connection:Upgrade
Upgrade: websocket
Sec-WebSocket-Accept: Oy4NRAQ13jhfONC7bP8dTKb4PTU=
```

```
Sec-WebSocket-Accept根据客户端请求首部的Sec-WebSocket-Key计算出来。
toBase64( sha1( Sec-WebSocket-Key + 258EAFA5-E914-47DA-95CA-C5AB0DC85B11 )  )
```

# 2.websocket的简单使用

## 2.1.websocket的创建

```
以下 API 用于创建 WebSocket 对象。

var Socket = new WebSocket(url, [protocol] );
以上代码中的第一个参数 url, 指定连接的 URL。第二个参数 protocol 是可选的，指定了可接受的子协议。

websocket 可以跟 HTTP 协议共用一个端口，它协议的前缀是 ws://，如果是 HTTPS，那么就是 wss://，    webSocket 没有同源限制，客户端可以发送任意请求到服务端，只要目标服务器允许。
```

## 2.2.websocket的属性和方法

以下是 WebSocket 对象的属性。假定我们使用了以上代码创建了 Socket 对象：

| 属性                  | 描述                                                         |
| :-------------------- | :----------------------------------------------------------- |
| Socket.readyState     | 只读属性 **readyState** 表示连接状态，可以是以下值：0 - 表示连接尚未建立。1 - 表示连接已建立，可以进行通信。2 - 表示连接正在进行关闭。3 - 表示连接已经关闭或者连接不能打开。 |
| Socket.bufferedAmount | 只读属性 **bufferedAmount** 已被 send() 放入正在队列中等待传输，但是还没有发出的 UTF-8 文本字节数。 |

```
CONNECTING：值为0，表示正在连接。

OPEN：值为1，表示连接成功，可以通信了。

CLOSING：值为2，表示连接正在关闭。

CLOSED：值为3，表示连接已经关闭，或者打开连接失败。
```



以下是 WebSocket 对象的相关事件。

| 事件    | 事件处理程序     | 描述                       |
| :------ | :--------------- | :------------------------- |
| open    | Socket.onopen    | 连接建立时触发             |
| message | Socket.onmessage | 客户端接收服务端数据时触发 |
| error   | Socket.onerror   | 通信发生错误时触发         |
| close   | Socket.onclose   | 连接关闭时触发             |



以下是 WebSocket 对象的相关方法。

| 方法           | 描述             |
| -------------- | ---------------- |
| Socket.send()  | 使用连接发送数据 |
| Socket.close() | 关闭连接         |

**websocket的使用**

```
 var ws = new WebSocket(url);

if (ws.readyState == ws.CONNECTING) {
    console.log('连接正在打开');
}

ws.onopen = function () {
    ws.send("xxx");
    //可以看到 "连接正在打开"并没有被打印，说明open对应的就是OPEN状态
    if (ws.readyState == ws.CONNECTING) {
        console.log('连接正在打开1');
    }
    if (ws.readyState == ws.OPEN) {
        console.log('连接已打开');
    }
};

//收到消息后触发
ws.onmessage = function () {
    ws.send("xxx");
}

//连接关闭时触发
ws.onclose = function () {
    if (ws.readyState == ws.CLOSED) {
        console.log('连接已关闭');
    }
};

//连接错误时触发
ws.onerror = function (err) {
    console(err);
};

ws.close();
```

## 2.3.node.js使用ws模块的WebSocket服务

```
安装ws模块
npm install ws --save
```

```
const WebSocket = require('ws')
const WebSocketServer = WebSocket.Server;

// 创建 websocket 服务器 监听在 3000 端口
const wss = new WebSocketServer({port: 3000 })

// 服务器被客户端连接
wss.on('connection', (ws) => {
    // 通过 ws 对象，就可以获取到客户端发送过来的信息和主动推送信息给客户端

    ws.on('massage', (msg) => {
        //msg是我们从客户端受到的消息
        ws.send(msg, (err) => {
            if (err) {
                console.log(err);
            }
        })
    })
})
```

### 2.3.1.事件监听

```
一般语法：.on(“event”, funcion)
这是ws服务器的事件监听
```

```
connection事件
var wss = new ws.Server({port: 3000});
wss.on("connection", (socket, request)=>{});
当握手完成后会发出，socket参数为WebSocket类型，request为http.IncomingMessage类型
一般在这个事件中通过socket.on注册socket的事件

error事件
var wss = new ws.Server({port: 3000});
wss.on("error", (error)=>{});
当依赖的httpServer出现错误时发出，error为Error类型

headers事件
var wss = new ws.Server({port: 3000});
wss.on("headers", (headers, request)=>{});
握手事件中，服务器即将响应请求时会发出这个事件，可以在方法中对headers进行修改
headers为数组类型，request为http.IncomingMessage类型

listening事件
var wss = new ws.Server({port: 3000});
wss.on("listening", ()=>{});
当绑定依赖的httoServer时发出
```

### 2.3.2.实例的监听事件

```
一般语法： websocket.on(“event”, Function())
无论是客户端还是服务端的实例都需要监听事件
```

```
message 事件
websocket.on("message", (data)=>{});
当收到消息时发出，data 类型为 String|Buffer|ArrayBuffer|Buffer[]

--------------------------------------------------------------------------
JavaScript 语言没有读取或操作二进制数据流的机制。
Node.js 中引入了 Buffer 类型使我们可以操作 TCP流 或 文件流。
Buffer 类型的对象类似于整数数组，但 Buffer 的大小是固定的、且在 V8 堆外分配物理内存。 Buffer 的大小在被创建时确定，且无法调整。（ buf.length 是固定的，不允许修改 ）
Buffer 是全局的，所以使用的时候无需 require() 的方式来加载
--------------------------------------------------------------------------

close 事件
websocket.on("close", (code, reason)=>{});
当连接断开时发出

error 事件
websocket.on("error", (error)=>{});

open 事件
websocket.on("open", ()=>{});
连接建立成功时发出

ping 事件
websocket.on("ping", (data)=>{});
收到ping消息时发出，data为Buffer类型

pong 事件
websocket.on("pong", (data)=>{});
收到pong消息时发出，data为Buffer类型

注：ping，pong事件通常用来检测连接是否仍联通，由客户端(服务端)发出一个ping事件，服务端（客户端）收到后回复一个pong事件，客户端（服务端）收到后就知道连接仍然联通

unexpected-response 事件
websocket.on("unexpected-response", (request, response)=>{});
request {http.ClientRequest} response {http.IncomingMessage}
当服务端返回的报文不是期待的结果，例如401，则会发出这个事件，如果这个事件没有被监听，则会抛出一个错误

upgrade事件
websocket.on("upgrade", (response)=>{});
response {http.IncomingMessage}
握手过程中，当收到服务端回复时发出该事件，你可以在response中查看cookie等header
```



