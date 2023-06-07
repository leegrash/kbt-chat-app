import { createStore } from "vuex";

export default createStore({
  state: {
    authenticated: false,
    msg: "",
    version: "",
    serverDown: false,
    awaitingResponse: false,
    authenticatedPsychologist: false,
    psychologistOnline: false,
    botOrder: ["Mark", "Laura", "Liza"],
    signOutInProgress: false,
    cookieConsent: false,
    awaitingPsychologistResponse: false,
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
    },
  },
  actions: {},
  modules: {},
});
