<template>
    <div class="container">
      <div class="row clearfix">
        <div class="col-lg-12">
          <div class="card chat-app">
            <div class="chat-info">
              <div
                v-if="$store.state.serverDown === true"
                role="alert"
                aria-live="polite"
                aria-atomic="true"
                class="alert text-center alert-danger"
              >
                Cant't connect to the server. Please wait a few minutes and try
                again.
              </div>
              <h1 class="page-title">Psychologist chats</h1>
              <div class="row page-content">
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import io from "socket.io-client";
  import Cookies from "js-cookie";
  
  export default {
    name: "PsychologistChatOverview",
    components: {},
    beforeRouteLeave(to, from, next) {
      this.socket.disconnect();
      next();
    },
    data: () => ({
      socket: io.connect({
        rejectUnauthorized: false,
      }),
    }),
  
    mounted() {
      this.socket.on("connect_error", () => {
        console.error("Socket connection error");
        this.$store.state.serverDown = true;
      });
      this.socket.on("connect", () => {
        this.$store.state.serverDown = false;
      });
  
      if (this.$store.state.serverDown === false) {
        this.socket.on("psychologistIdle", () => {
          this.$store.commit("setAuthenticated", false);
            this.$store.commit("setAuthenticatedPsychologist", false);
          document.cookie =
            "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          this.$store.state.msg = "idleSignout";
          this.$router.push("/psychologist-signin");
        });
      }
    },
    created() {
      const sessionId = Cookies.get("sessionId");
  
      document.onmousemove = () => {
        if (this.$store.state.authenticated !== false) {
          this.socket.emit("psychologistNotIdle", sessionId);
        }
      };
      document.onkeydown = () => {
        if (this.$store.state.authenticated !== false) {
          this.socket.emit("psychologistNotIdle", sessionId);
        }
      };
      document.onmousedown = () => {
        if (this.$store.state.authenticated !== false) {
          this.socket.emit("psychologistNotIdle", sessionId);
        }
      };
    },
    methods: {
      redirect(target, version = null) {
        if (version == null) {
          this.$router.push(target);
        } else {
          this.$store.state.version = version;
          this.$router.push(target);
        }
      },
    },
  };
  </script>
  