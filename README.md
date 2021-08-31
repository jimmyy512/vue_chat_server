# vue_chat_server
利用vue搭配Nodejs來簡單實作聊天室
並且利用GCP服務架設

## 線上demo
https://vue-chat-demo.jimmyy512.com/

## 說明
### Client(Vue.js)端設定
打開"client/src/main.js"文件,connection地方可填入server ip
```
Vue.use(new VueSocketIO({
    debug: true,
    connection: '連接server IP', //填入連接server IP
    vuex: {
      store,  
      actionPrefix: 'SOCKET_',  
      mutationPrefix: 'SOCKET_'  
    }
}))
```
### Server(Node.js)端設定
打開"server/index.js"文件,server listen地方可填入,server的port.
server.listen(改成自己想要的port,()=>{ console.log("server start"); });
輸入node index.js來啟動伺服器
