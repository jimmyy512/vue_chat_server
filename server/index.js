const express = require("express");
const path = require("path");
const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server);

//聊天室內容
var chatList = new Map();
//socket id當key
var userList = new Map();

//產生uuid
function _uuid() {
  var d = Date.now();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

/**
 * 產生聊天內容格式
 * @param {*} user user nick name,if server talk,pass 'server'.
 * @param {*} text user post text content.
 */
function createChatObj(user="server",text){
  let uid=_uuid();
  let local = new Date();
  let hour = local.getHours().toString();
  let min = local.getMinutes().toString();
  min = min.length == 1 ? "0" + min : min;
  let obj={
    uid:uid,
    user:user,
    text:text,
    sendTime: `${hour}:${min}`
  }
  chatList.set(uid,obj)
  return obj;
}

//跨網域
app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  if (req.method == "OPTIONS") res.send(200);
  else next();
});

io.on("connection", socket => {
  console.log(`${socket.id} is connect,online:${userList.size}`);
  socket.on("readyInit", () => {
    socket.emit("init",JSON.stringify(Array.from(chatList.entries())));
  });

  socket.on("MyReconnect:", userName => {
    console.log("reconnect:",userName);
    userList.set(socket.id, { user: userName });
  });

  socket.on("createUser", userName => {
    userList.set(socket.id, { user: userName });
    io.emit("serverTalk",createChatObj("server",`${userName} 已經加入了聊天室`));
  });

  socket.on("sendMessage", text => {
    let obj= createChatObj(userList.get(socket.id).user,text)
    socket.broadcast.emit("someOnePostMessage", obj);
    socket.emit("SuccessSendMessage", obj);
  });

  //伺服器有人下注通知
  socket.on("postBetEvent", (betData) => {
    let userName=userList.get(socket.id).user
    let obj=createChatObj("server",`${userName} 已下注點擊跟注`)
    obj.betData=betData;
    obj.betCount=0;
    io.emit("serverTalk", obj);
  });

  //跟注成功次數+1
  socket.on("addBetCountEvent", (uid) => {
    chatList.get(uid).betCount++;
    io.emit("updateClientBetCount",chatList.get(uid))
  });

  //發送禮物
  socket.on("postGiftEvent", (giftData) => {
    let userName=userList.get(socket.id).user
    let obj=createChatObj("server",`${userName} 送出了${giftData.name} 禮物`)
    obj.giftData=giftData;
    io.emit("serverTalk", obj);
  });


  socket.on("disconnect", () => {
    userList.delete(socket.id);
  });
});

server.listen(8787, () => {
  console.log("server start");
});
