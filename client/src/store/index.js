import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    readyInit: false
  },
  mutations: {
    SOCKET_init (state, data)
    {
      state.readyInit = data;
    }
  },
  actions: {},
  modules: {}
});
