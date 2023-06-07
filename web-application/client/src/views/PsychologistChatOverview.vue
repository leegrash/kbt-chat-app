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
            <h1 class="page-title">Psychologist chats</h1>
            <div
              v-for="user in Object.keys(conversations)"
              :key="user"
              class="row page-content"
            >
              <h3>{{ user }}</h3>
              <button
                v-for="conversation in conversations[user]"
                :key="conversation.conversationId"
                type="button"
                :class="
                  conversation.unanswered === false
                    ? 'btn btn-success chat-overview-btn'
                    : 'btn btn-warning chat-overview-btn'
                "
                @click="
                  redirect(conversation.conversationId, conversation.userName)
                "
              >
                {{ conversation.messageTitle }}
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
  name: "PsychologistChatOverview",
  components: {},
  beforeRouteLeave(to, from, next) {
    this.socket.disconnect();
    next();
  },
  data: () => ({
    socket: io.connect({
      rejectUnauthorized: false,
    }),
    conversations: [],
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
      this.socket.on("psychologistIdle", () => {
        this.$store.commit("setAuthenticated", false);
        this.$store.commit("setAuthenticatedPsychologist", false);
        document.cookie =
          "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        this.$store.state.msg = "idleSignout";
        this.$router.push("/psychologist-signin");
      });

      this.socket.on("psychologistConversationsUpdate", () => {
        fetch("/api/load-psychologist-conversations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            this.conversations = data;
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });

      this.socket.on("newMessageFromBot", () => {
        fetch("/api/load-psychologist-conversations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            this.conversations = data;
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
    }

    window.addEventListener("beforeunload", this.signOutPsychologist);
  },
  created() {
    const sessionId = Cookies.get("sessionId");

    document.onmousemove = () => {
      if (this.$store.state.authenticated !== false) {
        this.socket.emit("psychologistNotIdle", sessionId);
      }
    };
    document.onkeydown = () => {
      if (this.$store.state.authenticated !== false) {
        this.socket.emit("psychologistNotIdle", sessionId);
      }
    };
    document.onmousedown = () => {
      if (this.$store.state.authenticated !== false) {
        this.socket.emit("psychologistNotIdle", sessionId);
      }
    };

    fetch("/api/load-psychologist-conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.conversations = data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  },
  methods: {
    redirect(conversationId, userName) {
      this.$router.push({
        path: `/psychologist-chat/${conversationId}/${userName}`,
        params: {
          conversation: conversationId,
          user: userName,
        },
      });
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
