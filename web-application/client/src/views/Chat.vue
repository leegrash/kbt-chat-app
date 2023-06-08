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
                      v-if="$store.state.version === 'gpt_default'"
                      src="https://bootdey.com/img/Content/avatar/avatar2.png"
                      alt="avatar"
                    />
                    <img
                      v-if="$store.state.version === 'gpt_extended'"
                      src="https://bootdey.com/img/Content/avatar/avatar8.png"
                      alt="avatar"
                    />
                    <img
                      v-if="$store.state.version === 'psychologist'"
                      src="https://bootdey.com/img/Content/avatar/avatar3.png"
                      alt="avatar"
                    />
                  </a>
                  <div class="chat-about">
                    <h6 class="m-b-0">
                      {{ botName }}
                    </h6>
                    <small
                      ><button
                        v-if="conversationInProgress"
                        type="button"
                        class="btn btn-primary"
                        @click="newConversation()"
                      >
                        New conversation
                      </button></small
                    >
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
                        ? 'message my-message'
                        : 'message other-message'
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
                        :src="getVideoUrl(currMessage.videoId)"
                        allowfullscreen
                      ></iframe>
                    </div>
                  </div>
                </li>
                <li class="clearfix message-list">
                  <div v-if="typing" class="message other-message">
                    <div class="typing">
                      <div class="dot"></div>
                      <div class="dot"></div>
                      <div class="dot"></div>
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
            <div
              v-if="prevConversations.length !== 0"
              class="past-conversations"
            >
              <button
                v-for="prevConversation in prevConversations"
                :key="prevConversation.id"
                type="button"
                class="btn btn-primary"
                @click="loadPrevConversation(prevConversation.id)"
              >
                {{ prevConversation.title }}
              </button>
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
  name: "ChatView",
  components: {},
  beforeRouteLeave(to, from, next) {
    if (!this.$store.state.signOutInProgress) {
      fetch("/api/clear-empty-conversations", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status !== 200)
            throw new Error("Failed to clear empty conversations");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    this.socket.disconnect();
    next();
  },
  data: () => ({
    socket: io.connect(),
    availabletimeslots: [],
    conversationInProgress: false,
    messages: [],
    prevConversations: [],
    botName: "",
    typing: false,
  }),
  watch: {
    "$store.state.version": {
      handler() {
        if (this.$store.state.signOutInProgress) return;

        fetch("/api/clear-empty-conversations", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            if (res.status !== 200)
              throw new Error("Failed to clear empty conversations");
          })
          .catch((error) => {
            console.error("Error:", error);
          });

        fetch("/api/load-conversation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ version: this.$store.state.version }),
        })
          .then((response) => response.json())
          .then((data) => {
            this.messages = data.messages;
            this.prevConversations = data.prevTitles;
          })
          .catch((error) => {
            console.error("Error:", error);
          });

        this.conversationInProgress = false;
        if (this.$store.state.version === "gpt_default") {
          this.botName = "Mike";
        } else if (this.$store.state.version === "gpt_extended") {
          this.botName = "Laura";
        } else if (this.$store.state.version === "psychologist") {
          this.botName = "Liza";
        }
      },
      deep: false,
      immediate: true,
    },
  },
  mounted() {
    this.socket.on("connect_error", () => {
      console.error("Socket connection error");
      this.$store.state.serverDown = true;
    });
    this.socket.on("connect", () => {
      this.$store.state.serverDown = false;
      this.loadPrevConversation(Cookies.get("conversationId"));
    });

    if (this.$store.state.serverDown === false) {
      this.socket.on("userIdle", () => {
        this.$store.commit("setAuthenticated", false);
        document.cookie =
          "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        this.$store.state.msg = "idleSignout";
        this.$router.push("/signin");
      });

      if (this.$store.state.version === "psychologist") {
        this.socket.on("newMessageFromBot", () => {
          this.typing = false;
          this.$store.state.awaitingPsychologistResponse = false;
          document.getElementById("message").disabled = false;
          document.getElementById("message").placeholder = "Enter text here...";
          this.reloadConversation();
        });
      }
    }

    window.addEventListener("beforeunload", this.signOutUser);

    const chatHistory = document.getElementById("chat-history");
    chatHistory.scrollTop = chatHistory.scrollHeight;
  },
  created() {
    this.laodPage();
    if (this.$store.state.version === "gpt_default") {
      this.botName = "Mike";
    } else if (this.$store.state.version === "gpt_extended") {
      this.botName = "Laura";
    } else if (this.$store.state.version === "psychologist") {
      this.botName = "Liza";
    }
  },
  methods: {
    laodPage() {
      const sessionId = Cookies.get("sessionId");
      this.conversationInProgress = false;

      if (this.$store.state.serverDown === false) {
        fetch("/api/load-conversation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ version: this.$store.state.version }),
        })
          .then((response) => response.json())
          .then((data) => {
            this.messages = data.messages;
            this.prevConversations = data.prevTitles;
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
    },

    sendMessage() {
      if (this.$store.state.serverDown === true) {
        return;
      }

      if (this.$store.state.version !== "psychologist") {
        this.$store.state.awaitongResponse = true;
      } else {
        this.$store.state.awaitingPsychologistResponse = true;
      }

      const message = document.getElementById("message").value;

      if (message === "") return;

      document.getElementById("message").value = "";

      document.getElementById("message").disabled = true;
      document.getElementById("message").placeholder = "Awaiting response...";

      this.messages.push({
        message,
        sender: "user",
        videoId: null,
      });

      this.typing = true;

      this.$nextTick(() => {
        const chatHistory = document.getElementById("chat-history");
        chatHistory.scrollTop = chatHistory.scrollHeight;
        this.conversationInProgress = true;
      });

      fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          version: this.$store.state.version,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.messages = data.formatedMessages;
          this.$store.state.awaitongResponse = false;

          if (this.$store.state.version !== "psychologist") {
            document.getElementById("message").disabled = false;
            document.getElementById("message").placeholder =
              "Type a message...";
          }

          if (this.$store.state.version !== "psychologist") {
            this.typing = false;
          }

          this.$nextTick(() => {
            const chatHistory = document.getElementById("chat-history");
            chatHistory.scrollTop = chatHistory.scrollHeight;
            this.conversationInProgress = true;
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          this.$store.state.awaitongResponse = false;
          if (this.$store.state.version !== "psychologist") {
            document.getElementById("message").disabled = false;
            document.getElementById("message").placeholder =
              "Type a message...";
          }
        });
    },

    loadPrevConversation(conversationId) {
      if (this.$store.state.serverDown === true) {
        return;
      }

      if (this.$store.state.awaitongResponse === true) {
        return;
      }

      if (this.$store.state.awaitingPsychologistResponse === true) {
        return;
      }

      fetch("/api/load-prev-conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          version: this.$store.state.version,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.messages = data.formatedMessages;
          this.prevConversations = data.prevTitles;
          if (this.messages.length > 1) {
            this.conversationInProgress = true;
          }

          this.$nextTick(() => {
            const chatHistory = document.getElementById("chat-history");
            chatHistory.scrollTop = chatHistory.scrollHeight;
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },

    newConversation() {
      if (this.$store.state.serverDown === true) {
        return;
      }

      if (this.$store.state.awaitongResponse === true) {
        return;
      }

      if (this.$store.state.awaitingPsychologistResponse === true) {
        return;
      }

      fetch("/api/new-conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: this.$store.state.version,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.messages = data.messages;
          this.prevConversations = data.prevTitles;
          if (this.messages.length > 1) {
            this.conversationInProgress = true;
          }

          this.$nextTick(() => {
            const chatHistory = document.getElementById("chat-history");
            chatHistory.scrollTop = chatHistory.scrollHeight;
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },

    reloadConversation() {
      fetch("/api/reload-conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: this.$store.state.version,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.messages = data.formatedMessages;
          if (this.messages.length > 1) {
            this.conversationInProgress = true;
          }

          this.$nextTick(() => {
            const chatHistory = document.getElementById("chat-history");
            chatHistory.scrollTop = chatHistory.scrollHeight;
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },

    getVideoUrl(videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    },

    formatMessageLinks(message) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const sanitizedMessage = message.replace(urlRegex, (url) => {
        const sanitizedURL = DOMPurify.sanitize(url);
        return `<a href="${sanitizedURL}" target="_blank">${sanitizedURL}</a>`;
      });
      return sanitizedMessage;
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
