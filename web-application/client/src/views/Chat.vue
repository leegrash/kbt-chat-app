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
                <input
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

    this.socket.on("booking-timeslot", (data) => {
      const btnId = data[0];
      const action = data[1];

      if (action === "reserved") {
        document.getElementById(btnId).disabled = true;
        document.getElementById(btnId).classList.remove("btn-info");
        document.getElementById(btnId).classList.add("btn-warning");
      } else if (action === "available") {
        if (document.getElementById(btnId).classList.contains("btn-danger")) {
          return;
        }
        document.getElementById(btnId).disabled = false;
        document.getElementById(btnId).classList.remove("btn-warning");
        document.getElementById(btnId).classList.add("btn-info");
      } else if (action === "booked") {
        document.getElementById(btnId).disabled = true;
        document.getElementById(btnId).classList.remove("btn-info");
        document.getElementById(btnId).classList.add("btn-danger");
      }
    });

    this.socket.on("all-timeslots", (data) => {
      this.availabletimeslots = data;
    });
  },
  created() {},
  methods: {},
};
</script>
