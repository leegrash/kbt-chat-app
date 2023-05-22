<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a href="#" class="navbar-brand">AI Psychologist</a>
      <button
        type="button"
        class="navbar-toggler"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbarCollapse" class="collapse navbar-collapse">
        <div class="navbar-nav">
          <a
            v-if="$store.state.authenticated && !$store.state.authenticatedPsychologist"
            href="#"
            class="nav-item nav-link active"
            @click="redirect('/survey-info')"
            >Survey Info</a
          >
          <a
            v-if="$store.state.authenticated && !$store.state.authenticatedPsychologist"
            href="#"
            class="nav-item nav-link active"
            @click="redirect('/chat', 'gpt_default')"
            >Chatbot A</a
          >
          <a
            v-if="$store.state.authenticated && !$store.state.authenticatedPsychologist"
            href="#"
            class="nav-item nav-link active"
            @click="redirect('/chat', 'gpt_extended')"
            >Chatbot B</a
          >
          <a
            v-if="$store.state.authenticated && !$store.state.authenticatedPsychologist"
            href="#"
            class="nav-item nav-link active"
            @click="redirect('/chat', 'psychologist')"
            >Chatbot C</a
          >
          <a
            v-if="$store.state.authenticated && !$store.state.authenticatedPsychologist"
            href="#"
            class="nav-item nav-link active"
            >Survey form <i class="bi bi-box-arrow-up-right"></i
          ></a>
        </div>
        <div v-if="!$store.state.authenticated" class="navbar-nav ms-auto">
          <a
            href="mailto:email@example.com?subject=Kbt bot contact"
            class="btn btn-info"
            >Contact <i class="bi bi-envelope"></i
          ></a>
          <button
            v-if="isSigninRoute()"
            type="button"
            class="btn btn-primary"
            @click="redirect('/signup')"
          >
            Sign up <i class="bi bi-person-add"></i>
          </button>
          <button
            v-if="!isSigninRoute()"
            type="button"
            class="btn btn-primary"
            @click="redirect('/signin')"
          >
            Sign in <i class="bi bi-box-arrow-in-right"></i>
          </button>
          <button
            type="button"
            class="btn btn-info"
            @click="redirect('/psychologist-signin')"
          >
            Psychologist <i class="bi bi-box-arrow-in-right"></i>
          </button>
        </div>
        <div v-if="$store.state.authenticated && !$store.state.authenticatedPsychologist" class="navbar-nav ms-auto">
          <a
            href="mailto:email@example.com?subject=Kbt bot contact"
            class="btn btn-info"
            >Contact <i class="bi bi-envelope"></i
          ></a>
          <button type="button" class="btn btn-danger" @click="signOut()">
            <i class="bi bi-box-arrow-left"></i> Sign out
          </button>
        </div>
        <div v-if="$store.state.authenticated && $store.state.authenticatedPsychologist" class="navbar-nav ms-auto">
          <a
            href="mailto:email@example.com?subject=Kbt bot contact"
            class="btn btn-info"
            >Contact <i class="bi bi-envelope"></i
          ></a>
          <button type="button" class="btn btn-danger" @click="signOutPsychologist()">
            <i class="bi bi-box-arrow-left"></i> Sign out
          </button>
        </div>
      </div>
    </div>
  </nav>

  <link
    href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
    rel="stylesheet"
  />

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
    push(getters.isAuthenticated === true ? "/survey-info" : "/signin");
  },
  methods: {
    redirect(target, version = null) {
      if (this.$store.state.serverDown === true) {
        return;
      }

      if (this.$store.state.awaitongResponse === true) {
        return;
      }

      if (version == null) {
        this.$router.push(target);
      } else {
        this.$store.state.version = version;
        this.$router.push(target);
      }
    },
    signOut() {
      if (this.$store.state.serverDown === true) {
        return;
      }

      fetch("/api/signout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      this.$store.commit("setAuthenticated", false);
      this.$store.state.version = null;
      this.$store.state.msg = "Successfully signed out!";
      this.$router.push("/signin");
    },
    isSigninRoute() {
      return this.$route.path === "/signin";
    },
    signOutPsychologist() {
      if (this.$store.state.serverDown === true) {
        return;
      }

      fetch("/api/psychologist-signout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      this.$store.commit("setAuthenticatedPsychologist", false);
      this.$store.commit("setAuthenticated", false);
      this.$store.state.msg = "Successfully signed out!";
      this.$router.push("/psychologist-signin");
    },
  },
};
</script>

<style>
@import url("bootstrap/dist/css/bootstrap.css");
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");
@import url("./style.css");
</style>
