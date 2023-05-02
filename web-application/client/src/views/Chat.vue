<template>
  <div class="container">
    <div class="row clearfix">
      <div class="col-lg-12">
        <div class="card chat-app">
          <div class="chat">
            <div class="chat-header clearfix">
              <h1 class="page-title">{{ $store.state.version }} domaini chatbot</h1>
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
                    <h6 class="m-b-0">Aiden Chavez</h6>
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
                />
                <button type="button" class="btn btn-primary">
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

export default {
  name: "ShowTimeslotsView",
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
    console.log("state-version (chat): " +  this.$store.state.version)
  },
  created() {},
  methods: {},
};
</script>
