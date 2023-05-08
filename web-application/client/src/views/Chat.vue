<template>
  <div class="container">
    <div class="row clearfix">
      <div class="col-lg-12">
        <div class="card chat-app">
          <div class="chat">
            <div class="chat-header clearfix">
              <!-- if server is down -->
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
                      {{ $store.state.version }} domain chatbot
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
                    {{ currMessage.message }}
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

export default {
  name: "ChatView",
  components: {},
  // sometimes the user will leave the page without starting the conversation
  beforeRouteLeave(to, from, next) {
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

    this.socket.disconnect();
    next();
  },
  data: () => ({
    socket: io.connect(),
    availabletimeslots: [],
    conversationInProgress: false,
    messages: [],
    prevConversations: [],
  }),
  // when version changes this acts reactively
  watch: {
    "$store.state.version": {
      handler() {
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
      },
      deep: false,
      immediate: true,
    },
  },
  // when a component is mounted, the socket connection is established
  mounted() {
    // checks connection
    this.socket.on("connect_error", () => {
      console.error("Socket connection error");
      this.$store.state.serverDown = true;
    });
    this.socket.on("connect", () => {
      this.$store.state.serverDown = false;
      this.laodPage();
    });

    // checks if user is idle
    if (this.$store.state.serverDown === false) {
      this.socket.on("userIdle", () => {
        this.$store.commit("setAuthenticated", false);
        document.cookie =
          "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        this.$store.state.msg = "idleSignout";
        this.$router.push("/signin");
      });
    }

    // gets chat history and scrolls to bottom
    const chatHistory = document.getElementById("chat-history");
    chatHistory.scrollTop = chatHistory.scrollHeight;
  },
  // when a component is created. Like a constructor
  created() {
    this.laodPage();
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
          body: JSON.stringify({ version: this.$store.state.version }), // sends version
        })
          .then((response) => response.json())
          .then((data) => {
            this.messages = data.messages;  // gets data
            this.prevConversations = data.prevTitles;
          })
          .catch((error) => {
            console.error("Error:", error);
          });

        // user idle check
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

      this.$store.state.awaitongResponse = true;

      const message = document.getElementById("message").value;

      if (message === "") return;

      document.getElementById("message").value = "";  // clears input

      this.messages.push({
        message,
        sender: "user",
      });
      
      this.$nextTick(() => {  // scrolls to bottom
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

          this.$nextTick(() => {  // scrolls to bottom
            const chatHistory = document.getElementById("chat-history");
            chatHistory.scrollTop = chatHistory.scrollHeight;
            this.conversationInProgress = true;
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          this.$store.state.awaitongResponse = false;
        });
    },

    loadPrevConversation(conversationId) {
      if (this.$store.state.serverDown === true) {
        return;
      }

      if (this.$store.state.awaitongResponse === true) {
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
          this.conversationInProgress = true;

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
          this.conversationInProgress = false;

          this.$nextTick(() => {
            const chatHistory = document.getElementById("chat-history");
            chatHistory.scrollTop = chatHistory.scrollHeight;
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  },
};
</script>
