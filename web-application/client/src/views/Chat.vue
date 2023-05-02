<template>
  <div class="container">
    <div class="row clearfix">
      <div class="col-lg-12">
        <div class="card chat-app">
          <div class="chat">
            <div class="chat-header clearfix">
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
                    <h6 class="m-b-0">{{ $store.state.version }} domain chatbot</h6>
                    <small><button v-if="conversationInProgress" type="button" class="btn btn-primary">New conversation</button></small>
                  </div>
                </div>
              </div>
            </div>
            <div id="chat-history" class="chat-history">
              <ul class="m-b-0">
                <li v-for="currMessage in messages" :key="currMessage.message"  class="clearfix message-list">
                  <div 
                  :class="
                    currMessage.sender !== 'bot'
                      ? 'message my-message'
                      : 'message other-message'
                  ">{{ currMessage.message }}</div>
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
                <button type="button" class="btn btn-primary" @click="sendMessage()">
                  Send <i class="bi bi-send-fill"></i>
                </button>
              </div>
            </div>
            <div v-if="prevConversations.length !== 0" class="past-conversations">
              <button 
              v-for="prevConversation in prevConversations" :key="prevConversation.id" type="button" class="btn btn-primary">
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
import Cookies from 'js-cookie'

export default {
  name: "ChatView",
  components: {},
  beforeRouteLeave(to, from, next) {
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
  watch: {
    '$store.state.version'(to, from) {
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
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  },
  mounted() {
    const chatHistory = document.getElementById("chat-history");
    chatHistory.scrollTop = chatHistory.scrollHeight;

    this.socket.on("userIdle", () => {
      this.$store.commit("setAuthenticated", false);
      document.cookie =
        "authCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      this.$store.state.msg = "idleSignout";
      this.$router.push("/signin");
    });
  },
  created() {
    const sessionId = Cookies.get("sessionId");

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
        console.log(data);
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
  },
  methods: {
    sendMessage() {
      const message = document.getElementById("message").value;

      if(message === "") return;

      document.getElementById("message").value = "";

      fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          version: this.$store.state.version,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.messages = data.formatedMessages;
          console.log(this.messages);

          this.$nextTick(() => {
            const chatHistory = document.getElementById("chat-history");
            chatHistory.scrollTop = chatHistory.scrollHeight;
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });

    }
  },
};
</script>
