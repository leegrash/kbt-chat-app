<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a href="#" class="navbar-brand">Therapy bot</a>
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
          <template
            v-if="
              $store.state.authenticated &&
              !$store.state.authenticatedPsychologist
            "
          >
            <a
              href="#"
              class="nav-item nav-link active"
              @click="redirect('/survey-info')"
              >Survey Info</a
            >
            <template v-if="$store.state.psychologistOnline">
              <template
                v-if="
                  $store.state.authenticated &&
                  !$store.state.authenticatedPsychologist
                "
              >
                <a
                  v-for="bot in $store.state.botOrder.filter(
                    (bot) => bot !== 'Laura'
                  )"
                  :key="bot"
                  href="#"
                  class="nav-item nav-link active"
                  @click="redirect('/chat', bot)"
                >
                  Chatbot: {{ bot }}
                </a>
              </template>
            </template>
            <template v-else>
              <a
                v-for="bot in $store.state.botOrder.filter(
                  (bot) => bot !== 'Liza'
                )"
                :key="bot"
                href="#"
                class="nav-item nav-link active"
                @click="redirect('/chat', bot)"
              >
                Chatbot: {{ bot }}
              </a>
            </template>
            <a
              v-if="$store.state.psychologistOnline"
              href="https://forms.gle/xSWXBGP6L3owM7Am6"
              target="_blank"
              rel="noopener noreferrer"
              class="nav-item nav-link active"
              >Survey form <i class="bi bi-box-arrow-up-right"></i
            ></a>
            <a
              v-else
              href="https://forms.gle/Uf45xPHNx74qx25X8"
              target="_blank"
              rel="noopener noreferrer"
              class="nav-item nav-link active"
              >Survey form <i class="bi bi-box-arrow-up-right"></i
            ></a>
          </template>
          <template v-if="$store.state.authenticatedPsychologist">
            <a
              href="#"
              class="nav-item nav-link active"
              @click="redirect('/psychologist-overview')"
              >Chat overview</a
            >
          </template>
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
            Admin <i class="bi bi-box-arrow-in-right"></i>
          </button>
        </div>
        <div
          v-if="
            $store.state.authenticated &&
            !$store.state.authenticatedPsychologist
          "
          class="navbar-nav ms-auto"
        >
          <a
            href="mailto:therapy.bot@outlook.com?subject=Therapy Bot Contact"
            class="btn btn-info"
            >Contact <i class="bi bi-envelope"></i
          ></a>
          <button type="button" class="btn btn-danger" @click="signOut()">
            <i class="bi bi-box-arrow-left"></i> Sign out
          </button>
        </div>
        <div
          v-if="
            $store.state.authenticated && $store.state.authenticatedPsychologist
          "
          class="navbar-nav ms-auto"
        >
          <a
            href="mailto:email@example.com?subject=Kbt bot contact"
            class="btn btn-info"
            >Contact <i class="bi bi-envelope"></i
          ></a>
          <button
            type="button"
            class="btn btn-danger"
            @click="signOutPsychologist()"
          >
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

  <div
    v-if="!$store.state.cookieConsent"
    class="d-flex justify-content-center mt-5 h-100"
  >
    <div
      class="d-flex align-items-center align-self-center cookie-card p-3 text-center cookies"
    >
      <img
        src="https://i.imgur.com/Tl8ZBUe.png"
        alt="cookie-img"
        width="50"
      /><span class="mt-2">This page requires cookies to function.</span>
      <button
        class="btn btn-dark mt-3 px-4"
        type="button"
        @click="giveCookieConsent()"
      >
        Okay
      </button>
    </div>
  </div>
</template>

<script>
import "bootstrap";
import io from "socket.io-client";

export default {
  name: "App",
  components: {},
  data: () => ({
    socket: io.connect(),
    psychologistOnline: false,
  }),
  mounted() {
    const { commit, getters } = this.$store;
    const { push } = this.$router;

    this.socket.on("psychologistOnline", () => {
      this.$store.state.psychologistOnline = true;
    });

    this.socket.on("psychologistOffline", () => {
      this.$store.state.psychologistOnline = false;
    });

    commit("setAuthenticated", false);
    push(getters.isAuthenticated === true ? "/survey-info" : "/signup");
  },
  methods: {
    giveCookieConsent() {
      this.$store.state.cookieConsent = true;
    },

    redirect(target, version = null) {
      if (this.$store.state.cookieConsent === false) {
        return;
      }
      if (this.$store.state.serverDown === true) {
        return;
      }
      if (this.$store.state.awaitongResponse === true) {
        return;
      }
      if (this.$store.state.awaitingPsychologistResponse === true) {
        return;
      }
      if (version == null) {
        this.$router.push(target);
      } else {
        if (version === "Mike") {
          this.$store.state.version = "gpt_default";
        } else if (version === "Laura") {
          this.$store.state.version = "gpt_extended";
        } else if (version === "Liza") {
          this.$store.state.version = "psychologist";
        } else {
          return;
        }
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
      this.$store.state.msg = "Successfully signed out!";
      this.$store.state.signOutInProgress = true;
      this.$store.state.version = null;
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
