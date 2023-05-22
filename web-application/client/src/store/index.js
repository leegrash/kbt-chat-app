import { createStore } from "vuex";

export default createStore({
  state: {
    authenticated: false,
    msg: "",
    version: "",
    serverDown: false,
    awaitingResponse: false,
    authenticatedPsychologist: false,
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
    setAuthenticatedPsychologist(state, authenticatedPsychologist) {
      state.authenticatedPsychologist = authenticatedPsychologist;
    }
  },
  actions: {},
  modules: {},
});
