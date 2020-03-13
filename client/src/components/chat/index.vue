<template>
  <div id="chat">
    <div
      ref="chatView"
      class="chatView"
      :style="!isfull?'height:100%;':''"
      @click="$emit('click')"
    >
      <div class="chatContent">
        <div
          v-for="(it,index) in chatList"
          class="chatBlock"
          :key="index"
          :class="it[1].user=='server'?'serverBlock':''"
        >
          <template v-if="it[1].user=='server'"
          >
            <div
              class="ServerTalk animated fadeIn"
              :class="ServerTalkCSS(it[1])"
              @click.stop="ServerTalkClick(it[1])"
            >
              {{ ServerTalkLabel(it[1]) }}
            </div>
          </template>

          <template v-else>
            <div class="talkBlock animated fadeIn">
              <span
                class="userName"
                :class="it[1].isMe?'isMe':'isOther'"
              >
                {{it[1].user}}
              </span>

              <span >
                {{it[1].text}}
              </span>
              <span class="talkTime">
                {{it[1].sendTime}}
              </span>

            </div>

          </template>
        </div>
      </div>
    </div>

    <div
      class="BottomBlock"
      v-if="isfull"
    >
      <div class="InputBlock">
        <img class="chatSVG" src="@/assets/chat.png"/>
        <textarea
          placeholder="寫點訊息給主播吧..."
          class="ChatBox"
          style="height: 36px;"
          v-model="textInput"
        ></textarea>
      </div>
      <img class="SendSVG" src="@/assets/send.png"  @click="sendMessage"/>
    </div>

    <el-dialog
      class="InputName"
      title="輸入聊天室名字"
      width="80%"
      center
      :modal="false"
      :show-close="false"
      :visible.sync="inputNameDialog"
      :before-close="()=>{}"
    >
      <el-input
        v-model="userName"
        placeholder="請輸入..."
      ></el-input>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitNameClick()"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// --- refs 直接呼叫method事件 ---
// refs.postBetEvent(betData) betData:Object
//   發送本地下注通知
// refs.postGiftEvent(giftData) giftData:Object
//   發送禮物通知
// refs.addBetCountEvent(uid) uid:String
//   發送本地跟注成功
// --- @監聽事件 ---
// @ServerGetBet
//   server通知有人下注
// @ServerGetGift
//   server通知有人送禮物
export default {
  name: "chat",
  props: {
    isfull: {
      type: Boolean,
      default: true
    }
  },
  data ()
  {
    return {
      textInput: "",
      userName: "test",
      chatList: new Map(),
      inputNameDialog: true
    };
  },
  mounted ()
  {
    this.$socket.emit("readyInit");
    // test
    // this.submitNameClick();
  },
  sockets: {
    disconnect: () =>
    {
      console.log("disconnect socket");
      this.chatList("GG", { user: "server", text: "聊天室已斷線,請稍後再試." });
    },
    reconnect: () =>
    {
      console.log("reconnect socket");
      this.$socket.emit("MyReconnect", this.userName);
    },
    init (data)
    {
      this.chatList = new Map(JSON.parse(data));
      this.chatList._set = this.chatList.set;
      // 重載map set function
      this.chatList.set = (key, value) =>
      {
        this.chatList._set(key, value);
        this.$forceUpdate();
      };
      this.scrollBottom();
    },
    someOnePostMessage (data)
    {
      data.isMe = false;
      this.chatList.set(data.uid, data);
      this.scrollBottom();
    },
    SuccessSendMessage (data)
    {
      data.isMe = true;
      this.chatList.set(data.uid, data);
      this.scrollBottom();
    },
    serverTalk (data)
    {
      this.chatList.set(data.uid, data);
      if (data.giftData)
        this.$emit("ServerGetGift", data.giftData);
      this.scrollBottom();
    },
    updateClientBetCount (data)
    {
      this.chatList.set(data.uid, data);
    }
  },
  methods: {
    // 發送下注資訊
    postBetEvent (betData)
    {
      this.$socket.emit("postBetEvent", betData);
    },
    // 下注成功次數加1
    addBetCountEvent (uid)
    {
      this.$socket.emit("addBetCountEvent", uid);
    },
    // 刷禮物
    postGiftEvent (giftData)
    {
      this.$socket.emit("postGiftEvent", giftData);
    },
    scrollBottom ()
    {
      this.$nextTick(() =>
      {
        this.$refs.chatView.scrollTo(0, 99999);
      });
    },
    ServerTalkCSS (chatData)
    {
      if (chatData.betData)
        return "betCSS";
      else if (chatData.giftData)
        return "giftCSS";
      else
        return "";
    },
    ServerTalkClick (chatData)
    {
      if (chatData.betData)
        this.$emit("ServerGetBet", chatData);
    },
    ServerTalkLabel (chatData)
    {
      if (chatData.betData)
        return `${chatData.text}  ${chatData.betCount == 0 ? "" : chatData.betCount}`;
      else
        return chatData.text;
    },
    submitNameClick ()
    {
      this.userName = this.userName.trim();
      if (this.userName == "" || this.userName == null)
      {
        this.$message({
          message: "名字輸入為空,請再次確認!",
          type: "warning"
        });
        return;
      }
      this.$socket.emit("createUser", this.userName);
      this.inputNameDialog = false;
      document.onkeydown =
      (e) =>
      {
        if (window.event.keyCode == 13)
          this.sendMessage();
      };
    },
    sendMessage ()
    {
      this.textInput = this.textInput.trim();
      if (this.textInput == "" || this.textInput == null)
      {
        this.$message({
          message: "尚未輸入內容",
          type: "warning"
        });
        return;
      }
      this.$socket.emit("sendMessage", this.textInput);
      this.textInput = null;
    }
  },
  watch: {
    isfull ()
    {
      this.scrollBottom();
    }
  }
};
</script>

<style lang="scss" scoped>
.animated{
  animation-duration: .4s;
}
#chat {
  width: 100%;
  height: 100%;
  padding: 0px 10px;
  color:white;
  textarea {
    -webkit-writing-mode: horizontal-tb !important;
    text-rendering: auto;
    color: -internal-light-dark-color(black, white);
    letter-spacing: normal;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    display: inline-block;
    text-align: start;
    -webkit-appearance: textarea;
    background-color: -internal-light-dark-color(white, black);
    -webkit-rtl-ordering: logical;
    flex-direction: column;
    resize: auto;
    cursor: text;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    margin: 0em;
    font: 400 11px system-ui;
    border-width: 1px;
    border-style: solid;
    border-color: initial;
    border-image: initial;
    padding: 2px;
  }
  .chatView {
    overflow: auto;
    width: 100%;
    height: calc(100% - 60px);
    background-color: transparent;
    .chatContent {
      height: 100%;
      .chatBlock {
        padding: 0 0 10px 0;
        font-size: 14px;
        line-height: 18px;
        display: flex;
        align-items: center;
        letter-spacing: 0.5px;
        text-align: left;
        .betCSS{
          color:orange;
        }
        .giftCSS{
          color: rgb(183, 117, 211);
        }
        .ServerTalk {
          background-color: rgba(128, 128, 128, 0.32);
          width: 80%;
          text-align: center;
          margin: 0 auto;
          padding: 5px;
          font-weight: bold;
          border-radius: 20px;
        }
        %talkBlockCommon {
          float: left;
          height: 100%;
          max-width: 95%;
          line-height: 25px;
          .userName {
            height: 25px;
            text-align: left;
            font-weight: bold;
          }
          .isMe {
            color: rgb(113, 203, 64);
          }
          .isOther{
            color: rgb(118, 154, 233);
          }
          word-break: break-all;
          border-radius: 20px;
          padding: 2vmin;
          background: rgba(0, 0, 0, 0.1);
          position: relative;
          text-align: left;

        }
        .talkBlock {
          @extend %talkBlockCommon;
          margin-left: 10px;
          .talkTime {
            font-size:10px;
          }
        }
      }
      .serverBlock {
        height: 50px;
      }
    }
  }
  .BottomBlock {
    background-color: transparent;
    height: 100%;
    max-height: 60px;
    display: flex;
    align-items: center;
    .InputBlock {
      background-color: rgba(255, 255, 255, 0.8);
      box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 0px 0px;
      width: 85%;
      height: 65%;
      border-radius: 20px;
      display: flex;
      align-items: center;
      padding: 0px 14px;
      .chatSVG {
        width: auto;
        height: 80%;
      }
      .ChatBox {
        margin-left: 3%;
        height: 100%;
        resize: none;
        width: 100%;
        -webkit-box-flex: 1;
        flex-grow: 1;
        font-size: 14px;
        font-weight: 500;
        color: rgb(40, 35, 45);
        line-height: 36px;
        padding: 0px;
        border-width: 0px;
        border-style: initial;
        border-color: initial;
        border-image: initial;
        outline: none;
        background-color: transparent;
        touch-action: manipulation;
      }
    }
    .SendSVG {
      width: auto;
      height: 80%;
      margin:0 auto;
    }
  }
}
</style>
