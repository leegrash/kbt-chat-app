<template>
  <div class="container">
    <div class="row clearfix">
      <div class="col-lg-12">
        <div class="card chat-app">
          <div class="chat">
            <div class="chat-header clearfix">
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
              <div class="row">
                <div class="col-lg-6">
                  <a
                    href="javascript:void(0);"
                    data-toggle="modal"
                    data-target="#view_info"
                  >
                    <img
                      src="https://bootdey.com/img/Content/avatar/avatar2.png"
                      alt="avatar"
                    />
                  </a>
                  <div class="chat-about">
                    <h6 class="m-b-0">
                      {{ user }}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
            <div id="chat-history" class="chat-history">
              <ul class="m-b-0">
                <li
                  v-for="currMessage in messages"
                  :key="currMessage.message"
                  class="clearfix message-list"
                >
                  <div
                    :class="
                      currMessage.sender !== 'bot'
                        ? 'message other-message'
                        : 'message my-message'
                    "
                  >
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <div v-html="formatMessageLinks(currMessage.message)"></div>
                    <div
                      v-if="currMessage.videoId !== null"
                      class="embed-responsive embed-responsive-16by9 message-video"
                    >
                      <iframe
                        title="message-video"
                        class="embed-responsive-item"
                        src="https://www.youtube.com/embed/674Ka18uFuA"
                        allowfullscreen
                      ></iframe>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="chat-message clearfix">
              <div class="input-group mb-0">
                <label for="message" class="visually-hidden"
                  >Enter message</label
                >
                <input
                  id="message"
                  type="text"
                  class="form-control"
                  placeholder="Enter text here..."
                  @keyup.enter="sendMessage()"
                />
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="sendMessage()"
                >
                  Send <i class="bi bi-send-fill"></i>
                </button>
              </div>
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
import DOMPurify from "dompurify";

export default {
  name: "PsychologistChatView",
  components: {},
  beforeRouteLeave(to, from, next) {
    this.socket.disconnect();
    next();
  },
  props: {
    conversation: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    socket: io.connect(),
    messages: [],
  }),
  mounted() {
    this.socket.on("connect_error", () => {
      console.error("Socket connection error");
      this.$store.state.serverDown = true;
    });
    this.socket.on("connect", () => {
      this.$store.state.serverDown = false;
      this.laodPage();
    });

    if (this.$store.state.serverDown === false) {
      this.socket.on("userIdle", () => {
        this.$store.commit("setAuthenticated", false);
        document.cookie =
          "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        this.$store.state.msg = "idleSignout";
        this.$router.push("/signin");
      });

      this.socket.on("newMessageFromUser", () => {
        this.laodPage();
      });
    }

    window.addEventListener("beforeunload", this.signOutPsychologist);

    const chatHistory = document.getElementById("chat-history");
    chatHistory.scrollTop = chatHistory.scrollHeight;
  },
  created() {
    this.laodPage();
  },
  methods: {
    laodPage() {
      const sessionId = Cookies.get("sessionId");
      this.conversationInProgress = false;

      if (this.$store.state.serverDown === false) {
        fetch("/api/load-psycholigist-conversation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId: this.conversation,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            this.messages = data.formatedMessages;
            this.conversationInProgress = true;

            this.$nextTick(() => {
              const chatHistory = document.getElementById("chat-history");
              chatHistory.scrollTop = chatHistory.scrollHeight;
            });
          })
          .catch((error) => {
            console.error("Error:", error);
          });

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
      }

      this.$nextTick(() => {
        const chatHistory = document.getElementById("chat-history");
        chatHistory.scrollTop = chatHistory.scrollHeight;
      });
    },

    sendMessage() {
      if (this.$store.state.serverDown === true) {
        return;
      }

      const message = document.getElementById("message").value;

      if (message === "") return;

      document.getElementById("message").value = "";

      this.messages.push({
        message,
        sender: "bot",
        videoId: null,
      });

      this.$nextTick(() => {
        const chatHistory = document.getElementById("chat-history");
        chatHistory.scrollTop = chatHistory.scrollHeight;
        this.conversationInProgress = true;
      });

      fetch("/api/send-psychologist-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          conversationId: this.conversation,
        }),
      });
    },

    formatMessageLinks(message) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const sanitizedMessage = message.replace(urlRegex, (url) => {
        const sanitizedURL = DOMPurify.sanitize(url);
        return `<a href="${sanitizedURL}" target="_blank">${sanitizedURL}</a>`;
      });
      return sanitizedMessage;
    },

    signOutPsychologist() {
      fetch("/api/psychologist-signout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    },
  },
};
</script>
