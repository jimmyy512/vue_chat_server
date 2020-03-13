<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}
html,
body,
#app {
  font-family: Helvetica, "Apple Color Emoji", Arial, "PingFang TC", "Heiti TC",
    "Microsoft Jhenghei", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: black;
}
</style>
