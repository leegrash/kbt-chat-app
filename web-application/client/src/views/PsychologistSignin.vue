<template>
  <div class="container">
    <div class="row clearfix">
      <div class="col-lg-12">
        <div class="card chat-app">
          <div class="chat">
            <h1 class="page-title">Admin sign in</h1>
            <form
              class="sign-in-form align-items-center"
              @submit.prevent="authenticate()"
            >
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
              <div
                v-if="$store.state.msg === 'User created'"
                role="alert"
                aria-live="polite"
                aria-atomic="true"
                class="alert text-center alert-success"
              >
                User created!
              </div>
              <div
                v-if="$store.state.msg === 'Successfully signed out!'"
                role="alert"
                aria-live="polite"
                aria-atomic="true"
                class="alert text-center alert-success"
              >
                Successfully signed out!
              </div>
              <div
                v-if="$store.state.msg === 'Wrong credentials'"
                role="alert"
                aria-live="polite"
                aria-atomic="true"
                class="alert text-center alert-danger"
              >
                Wrong username or password
              </div>
              <div
                v-if="$store.state.msg === 'Fill out all fields'"
                role="alert"
                aria-live="polite"
                aria-atomic="true"
                class="alert text-center alert-danger"
              >
                Fill out all fields
              </div>
              <div
                v-if="$store.state.msg === 'idleSignout'"
                role="alert"
                aria-live="polite"
                aria-atomic="true"
                class="alert text-center alert-warning"
              >
                You have been signed out due to inactivity
              </div>
              <div class="form-group input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><i class="bi bi-person-circle"></i
                  ></span>
                </div>
                <label for="username" class="visually-hidden"
                  >Enter username</label
                >
                <input
                  id="username"
                  v-model="username"
                  type="text"
                  class="form-control"
                  placeholder="Username"
                />
              </div>
              <div class="form-group input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><i class="bi bi-lock-fill"></i
                  ></span>
                </div>
                <label for="password" class="visually-hidden"
                  >Enter password</label
                >
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  class="form-control"
                  placeholder="Password"
                />
              </div>
              <button type="submit" class="btn btn-primary">Sign in</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PsychologistSigninView",
  beforeRouteLeave(to, from, next) {
    this.$store.state.msg = "";
    next();
  },
  data: () => ({
    username: "",
    password: "",
    msg: "",
  }),
  methods: {
    authenticate() {
      if (this.$store.state.serverDown === true) {
        return;
      }

      const { commit } = this.$store;
      const { push } = this.$router;

      if (this.password === "" || this.username === "") {
        this.$store.state.msg = "Fill out all fields";
        return;
      }

      fetch("/api/psychologist-signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      })
        .then((res) => {
          if (res.status === 202) return;

          this.$store.state.msg = "Wrong credentials";
          throw new Error("Wrong credentials");
        })
        .then(() => {
          commit("setAuthenticatedPsychologist", true);
          commit("setAuthenticated", true);
          push("/psychologist-overview");
        })
        .catch(console.error);
    },
  },
};
</script>
