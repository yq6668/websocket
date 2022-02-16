"use strict";

var ws = new WebSocket(url);

if (ws.readyState == ws.CONNECTING) {
  console.log('连接正在打开');
}

ws.onopen = function () {
  ws.send("xxx"); //可以看到 "连接正在打开"并没有被打印，说明open对应的就是OPEN状态

  if (ws.readyState == ws.CONNECTING) {
    console.log('连接正在打开1');
  }

  if (ws.readyState == ws.OPEN) {
    console.log('连接已打开');
  }
}; //收到消息后触发


ws.onmessage = function () {
  ws.send("xxx");
}; //连接关闭时触发


ws.onclose = function () {
  if (ws.readyState == ws.CLOSED) {
    console.log('连接已关闭');
  }
}; //连接错误时触发


ws.onerror = function (err) {
  console(err);
};

ws.close();