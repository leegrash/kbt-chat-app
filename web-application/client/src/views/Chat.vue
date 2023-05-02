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
                  </div>
                </div>
              </div>
            </div>
            <div id="chat-history" class="chat-history">
              <ul class="m-b-0">
                <li class="clearfix message-list">
                  <div class="message other-message">
                    Hi Aiden, how are you? How is the project coming along?
                  </div>
                </li>
                <li class="clearfix message-list">
                  <div class="message my-message">Are we meeting today?</div>
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
    clearTimeout(this.adminTimeout);
    next();
  },
  data: () => ({
    socket: io.connect(),
    availabletimeslots: [],
  }),

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

      console.log(`Sent message: ${message}`);
    }
  },
};
</script>
