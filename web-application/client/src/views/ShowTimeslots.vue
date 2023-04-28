<template>
  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />

  <div class="container">
  <div class="row clearfix">
      <div class="col-lg-12">
          <div class="card chat-app">
              <div id="plist" class="people-list">
                  <ul class="list-unstyled chat-list mt-2 mb-0">
                      <li class="clearfix">
                          <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar">
                          <div class="about">
                              <div class="name">Vincent Porter</div>
                              <div class="status"> <i class="fa fa-circle offline"></i> left 7 mins ago </div>                                            
                          </div>
                      </li>
                      <li class="clearfix active">
                          <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="avatar">
                          <div class="about">
                              <div class="name">Aiden Chavez</div>
                              <div class="status"> <i class="fa fa-circle online"></i> online </div>
                          </div>
                      </li>
                      <li class="clearfix">
                          <img src="https://bootdey.com/img/Content/avatar/avatar3.png" alt="avatar">
                          <div class="about">
                              <div class="name">Mike Thomas</div>
                              <div class="status"> <i class="fa fa-circle online"></i> online </div>
                          </div>
                      </li>
                  </ul>
              </div>
              <div class="chat">
                  <div class="chat-header clearfix">
                      <div class="row">
                          <div class="col-lg-6">
                              <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                                  <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="avatar">
                              </a>
                              <div class="chat-about">
                                  <h6 class="m-b-0">Aiden Chavez</h6>
                                  <small>Last seen: 2 hours ago</small>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="chat-history">
                      <ul class="m-b-0">
                          <li class="clearfix">
                              <div class="message-data text-right">
                                  <span class="message-data-time">10:10 AM, Today</span>
                                  <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar">
                              </div>
                              <div class="message other-message float-right"> Hi Aiden, how are you? How is the project coming along? </div>
                          </li>
                          <li class="clearfix">
                              <div class="message-data">
                                  <span class="message-data-time">10:12 AM, Today</span>
                              </div>
                              <div class="message my-message">Are we meeting today?</div>                                    
                          </li>                               
                          <li class="clearfix">
                              <div class="message-data">
                                  <span class="message-data-time">10:15 AM, Today</span>
                              </div>
                              <div class="message my-message">Project has been already finished and I have results to show you.</div>
                          </li>
                          <li class="clearfix">
                              <div class="message-data text-right">
                                  <span class="message-data-time">10:10 AM, Today</span>
                                  <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar">
                              </div>
                              <div class="message other-message float-right"> Hi Aiden, how are you? How is the project coming along? </div>
                          </li>
                          <li class="clearfix">
                              <div class="message-data">
                                  <span class="message-data-time">10:12 AM, Today</span>
                              </div>
                              <div class="message my-message">Are we meeting today?</div>                                    
                          </li>                               
                          <li class="clearfix">
                              <div class="message-data">
                                  <span class="message-data-time">10:15 AM, Today</span>
                              </div>
                              <div class="message my-message">Project has been already finished and I have results to show you.</div>
                          </li>
                          <li class="clearfix">
                              <div class="message-data text-right">
                                  <span class="message-data-time">10:10 AM, Today</span>
                                  <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar">
                              </div>
                              <div class="message other-message float-right"> Hi Aiden, how are you? How is the project coming along? </div>
                          </li>
                          <li class="clearfix">
                              <div class="message-data">
                                  <span class="message-data-time">10:12 AM, Today</span>
                              </div>
                              <div class="message my-message">Are we meeting today?</div>                                    
                          </li>                               
                          <li class="clearfix">
                              <div class="message-data">
                                  <span class="message-data-time">10:15 AM, Today</span>
                              </div>
                              <div class="message my-message">Project has been already finished and I have results to show you.</div>
                          </li>
                          <li class="clearfix">
                              <div class="message-data text-right">
                                  <span class="message-data-time">10:10 AM, Today</span>
                                  <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar">
                              </div>
                              <div class="message other-message float-right"> Hi Aiden, how are you? How is the project coming along? </div>
                          </li>
                          <li class="clearfix">
                              <div class="message-data">
                                  <span class="message-data-time">10:12 AM, Today</span>
                              </div>
                              <div class="message my-message">Are we meeting today?</div>                                    
                          </li>                               
                          <li class="clearfix">
                              <div class="message-data">
                                  <span class="message-data-time">10:15 AM, Today</span>
                              </div>
                              <div class="message my-message">Project has been already finished and I have results to show you.</div>
                          </li>
                          <li class="clearfix">
                              <div class="message-data text-right">
                                  <span class="message-data-time">10:10 AM, Today</span>
                                  <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar">
                              </div>
                              <div class="message other-message float-right"> Hi Aiden, how are you? How is the project coming along? </div>
                          </li>
                          <li class="clearfix">
                              <div class="message-data">
                                  <span class="message-data-time">10:12 AM, Today</span>
                              </div>
                              <div class="message my-message">Are we meeting today?</div>                                    
                          </li>                               
                          <li class="clearfix">
                              <div class="message-data">
                                  <span class="message-data-time">10:15 AM, Today</span>
                              </div>
                              <div class="message my-message">Project has been already finished and I have results to show you.</div>
                          </li>
                          <li class="clearfix">
                              <div class="message-data text-right">
                                  <span class="message-data-time">10:10 AM, Today</span>
                                  <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar">
                              </div>
                              <div class="message other-message float-right"> Hi Aiden, how are you? How is the project coming along? </div>
                          </li>
                          <li class="clearfix">
                              <div class="message-data">
                                  <span class="message-data-time">10:12 AM, Today</span>
                              </div>
                              <div class="message my-message">Are we meeting today?</div>                                    
                          </li>                               
                          <li class="clearfix">
                              <div class="message-data">
                                  <span class="message-data-time">10:15 AM, Today</span>
                              </div>
                              <div class="message my-message">Project has been already finished and I have results to show you.</div>
                          </li>
                          <li class="clearfix">
                              <div class="message-data text-right">
                                  <span class="message-data-time">10:10 AM, Today</span>
                                  <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar">
                              </div>
                              <div class="message other-message float-right"> Hi Aiden, how are you? How is the project coming along? </div>
                          </li>
                          <li class="clearfix">
                              <div class="message-data">
                                  <span class="message-data-time">10:12 AM, Today</span>
                              </div>
                              <div class="message my-message">Are we meeting today?</div>                                    
                          </li>                               
                          <li class="clearfix">
                              <div class="message-data">
                                  <span class="message-data-time">10:15 AM, Today</span>
                              </div>
                              <div class="message my-message">Project has been already finished and I have results to show you.</div>
                          </li>
                      </ul>
                  </div>
                  <div class="chat-message clearfix">
                      <div class="input-group mb-0">
                          <div class="input-group-prepend">
                              <span class="input-group-text"><i class="fa fa-send"></i></span>
                          </div>
                          <input type="text" class="form-control" placeholder="Enter text here...">                                    
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
  created() {
    fetch("/api/load-timeslots")
      .then((res) => res.json())
      .then((data) => {
        this.availabletimeslots = data;
      });

    this.adminTimeout = null;

    document.onmousemove = () => {
      if (this.$store.state.authenticated !== false) {
        clearTimeout(this.adminTimeout);
        this.adminTimeout = setTimeout(() => {
          console.log("You have been logged out due to mouse move inactivity");
          this.timeoutSignout();
        }, 10000);
      }
    };
    document.onkeydown = () => {
      if (this.$store.state.authenticated !== false) {
        clearTimeout(this.adminTimeout);
        this.adminTimeout = setTimeout(() => {
          console.log("You have been logged out due to key inactivity");
          this.timeoutSignout();
        }, 10000);
      }
    };
    document.onmousedown = () => {
      if (this.$store.state.authenticated !== false) {
        clearTimeout(this.adminTimeout);
        this.adminTimeout = setTimeout(() => {
          console.log("You have been logged out due to mouse click inactivity");
          this.timeoutSignout();
        }, 10000);
      }
    };
  },
  methods: {
    buttonClicked(timeslot) {
      console.log(timeslot);
      const { push } = this.$router;
      const userName = timeslot.assistant;
      const timeslotTime = timeslot.time;

      push({
        path: `/booking/${userName}/${timeslotTime}/${timeslot.id}`,
        params: {
          user: userName,
          timeslot: timeslotTime,
          timeslotId: timeslot.id,
        },
      });
    },
    timeoutSignout() {
      if (this.$store.state.authenticated !== false) {
        fetch("/api/logout", {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
          .then((res) => {
            if (res.status === 200) return res.json();
            throw new Error("Failed to sign out");
          })
          .then(({ authenticated }) => {
            this.$store.commit("setAuthenticated", authenticated);
            this.$router.push("/");
          })
          .catch(console.error);
      }
    },
  },
};
</script>
