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
            <h1 class="page-title">Information about survey</h1>
            <div class="row page-content">
              <p>Hello and welcome to our study!</p>
            </div>
            <template v-if="$store.state.psychologistOnline">
              <template v-for="bot in $store.state.botOrder" :key="bot">
                <div class="row page-content">
                  <h2>Chatbot: {{ bot }}</h2>
                  <p>
                    This is the
                    {{
                      formatedIndex($store.state.botOrder.indexOf(bot))
                    }}
                    Chatbot that you will be able to try. To start speaking to
                    it, click the button below or click on the Chatbot:
                    {{ bot }} tab in the navigation bar.
                  </p>
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="redirect('/chat', bot)"
                  >
                    Try Chatbot: {{ bot }}
                  </button>
                </div>
              </template>
            </template>
            <template v-if="!$store.state.psychologistOnline">
              <template
                v-for="bot in $store.state.botOrder.filter(
                  (bot) => bot !== 'Liza'
                )"
                :key="bot"
              >
                <div class="row page-content">
                  <h2>Chatbot: {{ bot }}</h2>
                  <p>
                    This is the
                    {{ 
                      formatedIndex($store.state.botOrder.filter(item => item !== 'Liza').indexOf(bot))
                    }}
                    Chatbot that you will be able to try. To start speaking to
                    it, click the button below or click on the Chatbot:
                    {{ bot }} tab in the navigation bar.
                  </p>
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="redirect('/chat', bot)"
                  >
                    Try Chatbot: {{ bot }}
                  </button>
                </div>
              </template>
            </template>
            <div class="row page-content">
              <h2>Survey form</h2>
              <p>
                Once you have tried all the Chatbots, please fill out the survey
                form. This will help us to evaluate the Chatbots for our
                Bachelor's thesis.
              </p>
              <a
                href="https://forms.gle/Uf45xPHNx74qx25X8"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-primary"
                >Fill out the survey form
                <i class="bi bi-box-arrow-up-right"></i
              ></a>
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
  name: "SurveryInfoView",
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
      this.socket.on("userIdle", () => {
        this.$store.commit("setAuthenticated", false);
        document.cookie =
          "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        this.$store.state.msg = "idleSignout";
        this.$router.push("/signin");
      });
    }
  },
  created() {
    const sessionId = Cookies.get("sessionId");

    document.onmousemove = () => {
      if (this.$store.state.authenticated !== false) {
        this.socket.emit("userNotIdle", sessionId);
      }
    };
    document.onkeydown = () => {
      if (this.$store.state.authenticated !== false) {
        this.socket.emit("userNotIdle", sessionId);
      }
    };
    document.onmousedown = () => {
      if (this.$store.state.authenticated !== false) {
        this.socket.emit("userNotIdle", sessionId);
      }
    };
  },
  methods: {
    redirect(target, version) {
      if (version === "Mike") {
        this.$store.state.version = "gpt_default";
      } else if (version === "Laura") {
        this.$store.state.version = "gpt_extended";
      } else if (version === "Liza") {
        this.$store.state.version = "psychologist";
      }

      this.$router.push(target);
    },

    formatedIndex(index) {
      const botIndex = index + 1;

      let formatedIndex = "";

      if (botIndex === 1) {
        formatedIndex = "first";
      } else if (botIndex === 2) {
        formatedIndex = "second";
      } else if (botIndex === 3) {
        formatedIndex = "third";
      }

      return formatedIndex;
    },
  },
};
</script>
