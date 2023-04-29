import { createStore } from "vuex";

export default createStore({
  state: {
    authenticated: false,
    msg: "",
  },
  getters: {
    isAuthenticated(state) {
      return state.authenticated;
    },
  },
  mutations: {
    setAuthenticated(state, authenticated) {
      state.authenticated = authenticated;
    },
  },
  actions: {},
  modules: {},
});
