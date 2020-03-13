# vue_chat_server

Client(Vue.js)端設定
打開"client/src/main.js"文件,connection地方可填入server ip

Vue.use(new VueSocketIO({

debug: true,

connection: '連接server IP', //填入連接server IP

vuex: {

  store,  

  actionPrefix: 'SOCKET_',  

  mutationPrefix: 'SOCKET_'  
}

}))

cmd 輸入

npm install

npm run dev

Server(Node.js)端設定
打開"server/index.js"文件,server listen地方可填入,server的port.

server.listen(改成自己想要的port,()=>{ console.log("server start"); });

cmd 輸入

npm install

node index.js
