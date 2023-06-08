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
              Can't connect to the server. Please wait a few minutes and try
              again.
            </div>
            <h1 class="page-title">Information about the study</h1>
            <div class="row page-content">
              <h3>Hello!</h3>
              <p>
                Welcome to our study about how well different chatbots perform
                wihtin the field of psychology!<br />
                You will be able to try out different chatbots and then fill out
                a survey about your experience.<br />
                The study will take about 20-30 minutes to complete. We thank
                you very much for your participation!
              </p>
              <p>
                <b>To participate in the study</b>, please follow the steps
                given below. These are the same steps that are described in the
                Google Form, but we have also included them here for your
                convenience.
              </p>
              <ol v-if="!$store.state.psychologistOnline" class="info-list">
                <li>
                  Fill out the basic information in the form from which you
                  came.
                </li>
                <li>
                  Talk to
                  <u
                    >Chatbot:
                    {{
                      $store.state.botOrder.filter((item) => item !== "Liza")[0]
                    }}</u
                  >
                  for about 5-10 minutes. You can click on the blue button
                  below, or in the navbar to do so. Try to ask questions that
                  you would ask to a real human pschologist or therapist in a
                  real scenario. The chatbot can answer questions about other
                  topics as well, but we are only interested in how you think
                  the chatbot preformed as a psychologist.
                </li>
                <li>
                  Fill out the next step of the form, containing questions about
                  Chatbot:
                  {{
                    $store.state.botOrder.filter((item) => item !== "Liza")[0]
                  }}.
                </li>
                <li>
                  Talk to
                  <u
                    >Chatbot:
                    {{
                      $store.state.botOrder.filter((item) => item !== "Liza")[1]
                    }}</u
                  >
                  for about 5-10 minutes. You can click on the other blue button
                  below, or in the navbar to do so. Try to ask questions that
                  you would ask to a real human pschologist or therapist in a
                  real scenario. The chatbot can answer questions about other
                  topics as well, but we are only interested in how you think
                  the chatbot preformed as a psychologist.
                </li>
                <li>
                  Fill out the next section of the form, containing questions
                  about Chatbot:
                  {{
                    $store.state.botOrder.filter((item) => item !== "Liza")[1]
                  }}.
                </li>
                <li>Answer the questions in the final section of the form.</li>
                <li>Done! Thank you!</li>
              </ol>
              <ol v-else class="info-list">
                <li>
                  Fill out the basic information in the form from which you
                  came.
                </li>
                <li>
                  Talk to
                  <u
                    >Chatbot:
                    {{
                      $store.state.botOrder.filter(
                        (item) => item !== "Laura"
                      )[0]
                    }}</u
                  >
                  for about 5-10 minutes. You can click on the blue button
                  below, or in the navbar to do so. Try to ask questions that
                  you would ask to a real human pschologist or therapist in a
                  real scenario. The chatbot can answer questions about other
                  topics as well, but we are only interested in how you think
                  the chatbot preformed as a psychologist.
                </li>
                <li>
                  Fill out the next step of the form, containing questions about
                  Chatbot:
                  {{
                    $store.state.botOrder.filter((item) => item !== "Laura")[0]
                  }}.
                </li>
                <li>
                  Talk to
                  <u
                    >Chatbot:
                    {{
                      $store.state.botOrder.filter(
                        (item) => item !== "Laura"
                      )[1]
                    }}</u
                  >
                  for about 5-10 minutes. You can click on the other blue button
                  below, or in the navbar to do so. Try to ask questions that
                  you would ask to a real human pschologist or therapist in a
                  real scenario. The chatbot can answer questions about other
                  topics as well, but we are only interested in how you think
                  the chatbot preformed as a psychologist.
                </li>
                <li>
                  Fill out the next section of the form, containing questions
                  about Chatbot:
                  {{
                    $store.state.botOrder.filter((item) => item !== "Laura")[1]
                  }}.
                </li>
                <li>Answer the questions in the final section of the form.</li>
                <li>Done! Thank you!</li>
              </ol>
            </div>
            <template v-if="$store.state.psychologistOnline">
              <template
                v-for="bot in $store.state.botOrder.filter(
                  (bot) => bot !== 'Laura'
                )"
                :key="bot"
              >
                <div class="row page-content">
                  <h2>Chatbot: {{ bot }}</h2>
                  <p>
                    This is the
                    {{
                      formatedIndex(
                        $store.state.botOrder
                          .filter((item) => item !== "Laura")
                          .indexOf(bot)
                      )
                    }}
                    Chatbot that you will be able to try. To start speaking to
                    it, click the button below or click on the Chatbot:
                    {{ bot }} tab in the navigation bar.
                  </p>
                  <p>
                    <button
                      type="button"
                      class="btn btn-primary"
                      @click="redirect('/chat', bot)"
                    >
                      Try Chatbot: {{ bot }}
                    </button>
                  </p>
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
                      formatedIndex(
                        $store.state.botOrder
                          .filter((item) => item !== "Liza")
                          .indexOf(bot)
                      )
                    }}
                    Chatbot that you will be able to try. To start speaking to
                    it, click the button below or click on the Chatbot:
                    {{ bot }} tab in the navigation bar.
                  </p>
                  <p>
                    <button
                      type="button"
                      class="btn btn-primary"
                      @click="redirect('/chat', bot)"
                    >
                      Try Chatbot: {{ bot }}
                    </button>
                  </p>
                </div>
              </template>
            </template>
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

    window.addEventListener("beforeunload", this.signOutUser);
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

    signOutUser() {
      fetch("/api/signout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    },
  },
};
</script>
