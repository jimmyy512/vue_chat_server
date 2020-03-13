<template>
  <div id="main">
    <button @click="isfull=!isfull"> switch</button>
    <button @click="postBetEvent"> 下注</button>
    <button @click="postGiftEvent"> 送禮物</button>
    <chat
      ref="chat"
      :class="isfull?'FullCSS':'notFullCSS'"
      :isfull="isfull"
      @click="isfull=!isfull"
      @ServerGetBet="ServerGetBet"
      @ServerGetGift="ServerGetGift"
    />
  </div>
</template>

<script>
import chat from "@/components/chat";
export default {
  components: {
    chat
  },
  data ()
  {
    return {
      isfull: false
    };
  },
  methods: {
    postBetEvent ()
    {
      const betData = {
        name: "test",
        value: "123"
      };
      this.$refs.chat.postBetEvent(betData);
    },
    ServerGetBet (betData)
    {
      // 收到其他玩家下注資料
      console.log("betData:", betData);
      const { uid } = betData;
      setTimeout(() =>
      {
        // 下注成功後 數量+1
        this.$refs.chat.addBetCountEvent(uid);
      }, 1000);
    },
    postGiftEvent ()
    {
      const giftData = {
        name: "鯊魚",
        value: "10"
      };
      this.$refs.chat.postGiftEvent(giftData);
    },
    ServerGetGift (giftData)
    {
      console.log("get giftData:", giftData);
    }
  }
};
</script>

<style lang="scss" scoped>
#main {
  position: relative;
  height: 100%;
  button{
    margin:10px;
    color:black;
    background-color: white;
  }
  .notFullCSS {
    position: absolute;
    width: 60vmin;
    height: 40vmin;
    top: 35vmin;
    left: 0;
    // z-index: 2;
  }
  .FullCSS {
    position: absolute;
    width: 100%;
    height: 50%;
    bottom: 0%;
    left: 0;
    // z-index: 2;
  }
}
</style>
