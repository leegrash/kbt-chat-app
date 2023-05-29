<template>
  <div class="container">
    <div class="row clearfix">
      <div class="col-lg-12">
        <div class="card chat-app">
          <div class="chat">
            <h1 class="page-title">Create an account</h1>
            <form class="sign-in-form" @submit.prevent="createUser()">
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
                v-if="$store.state.msg === 'Passwords don\'t match'"
                role="alert"
                aria-live="polite"
                aria-atomic="true"
                class="alert text-center alert-danger"
              >
                Passwords don't match
              </div>
              <div
                v-if="$store.state.msg === 'Password requirements not met'"
                role="alert"
                aria-live="polite"
                aria-atomic="true"
                class="alert text-center alert-danger"
              >
                Password requirements not met
              </div>
              <div
                v-if="$store.state.msg === 'Sign up failed'"
                role="alert"
                aria-live="polite"
                aria-atomic="true"
                class="alert text-center alert-danger"
              >
                Sign up failed
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
                <small class="form-text text-muted">
                  Password must be longer than 5 characters and include at least
                  1 number
                </small>
                <small class="form-text text-muted">
                  All passwords are stored encrypted and cannot be seen or
                  recognized by anyone.
                </small>
              </div>
              <div class="form-group input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><i class="bi bi-lock"></i
                  ></span>
                </div>
                <label for="confirmPassword" class="visually-hidden"
                  >Confirm password</label
                >
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  type="password"
                  class="form-control"
                  placeholder="Confirm password"
                />
              </div>
              <div class="form-group">
                <p>
                  Already have an account?
                  <router-link to="/signin">Sign in!</router-link>
                </p>
              </div>
              <button type="submit" class="btn btn-primary">Sign up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignupView",
  beforeRouteLeave(to, from, next) {
    if (this.$store.state.cookieConsent === false) {
      return;
    }

    if (this.$store.state.msg !== "User created") {
      this.$store.state.msg = "";
    }
    next();
  },
  data: () => ({
    username: "",
    password: "",
    confirmPassword: "",
  }),
  methods: {
    createUser() {
      if (this.$store.state.cookieConsent === false) {
        return;
      }

      if (this.$store.state.serverDown === true) {
        return;
      }

      const { push } = this.$router;

      if (
        this.password === "" ||
        this.username === "" ||
        this.confirmPassword === ""
      ) {
        this.$store.state.msg = "Fill out all fields";
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.$store.state.msg = "Passwords don't match";
        return;
      }
      if (this.password.length < 5 || !/\d/.test(this.password)) {
        this.$store.state.msg = "Password requirements not met";
        return;
      }

      fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      })
        .then((res) => {
          if (res.status === 201) return;

          this.$store.state.msg = "Sign up failed";
          throw new Error("Sign up failed");
        })
        .then(() => {
          this.$store.state.msg = "User created";
          push("/signin");
        })
        .catch(console.error);
    },
  },
};
</script>
