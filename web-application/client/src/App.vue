<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
          <a href="#" class="navbar-brand">KBT Chatbot</a>
          <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
              <span class="navbar-toggler-icon"></span>
          </button>
          <div id="navbarCollapse" class="collapse navbar-collapse">
              <div v-if="$store.state.authenticated" class="navbar-nav">
                  <a href="#" class="nav-item nav-link active">Chatbot 1</a>
                  <a href="#" class="nav-item nav-link active">Chatbot 2</a>
                  <a href="#" class="nav-item nav-link active">Chatbot 3</a>
              </div>
              <div v-if="!$store.state.authenticated" class="navbar-nav ms-auto">
                  <button v-if="isSigninRoute()" type="button" class="btn btn-primary" @click="redirect('/signup')">Sign up <i class="bi bi-box-arrow-in-right"></i></button>
                  <button v-if="!isSigninRoute()" type="button" class="btn btn-primary" @click="redirect('/login')">Sign in <i class="bi bi-box-arrow-in-right"></i></button>
              </div>
              <div v-if="$store.state.authenticated" class="navbar-nav ms-auto">
                  <button type="button" class="btn btn-danger" @click="signOut()">Sign out <i class="bi bi-box-arrow-left"></i></button>
              </div>
          </div>
      </div>
  </nav>

  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />

  <section class="container-fluid py-4">
    <router-view />
  </section>
</template>

<script>
// @ is an alias to /src
import "bootstrap";

export default {
  name: "App",
  components: {},
  data: () => ({}),
  mounted() {
    const { commit, getters } = this.$store;
    const { push } = this.$router;

    commit("setAuthenticated", false);
    push(getters.isAuthenticated === true ? "/chat" : "/login");
  },
  methods: {
    redirect(target) {
      this.$router.push(target);
    },
    signOut() {
      this.$store.commit("setAuthenticated", false);
      console.log("Signed out");
      this.$router.push("/login");
    },
    isSigninRoute() {
      return this.$route.path === "/login";
    },
  },
};
</script>

<style>
@import url("bootstrap/dist/css/bootstrap.css");
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");
@import "./style.css";
</style>
