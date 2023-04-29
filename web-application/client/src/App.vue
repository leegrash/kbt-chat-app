<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
          <a href="#" class="navbar-brand">KBT Chatbot</a>
          <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
              <span class="navbar-toggler-icon"></span>
          </button>
          <div id="navbarCollapse" class="collapse navbar-collapse">
              <div class="navbar-nav">
                  <a href="#" class="nav-item nav-link active">Chatbot 1</a>
                  <a href="#" class="nav-item nav-link active">Chatbot 2</a>
                  <a href="#" class="nav-item nav-link active">Chatbot 3</a>
              </div>
              <div class="navbar-nav ms-auto">
                  <a href="#" class="nav-item nav-link">Login</a>
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

    commit("setAuthenticated", true);
    push(getters.isAuthenticated === true ? "/login" : "/chat");
  },
  methods: {
    redirect(target) {
      this.$router.push(target);
    },
  },
};
</script>

<style>
@import url("bootstrap/dist/css/bootstrap.css");
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");
@import "./style.css";
</style>
