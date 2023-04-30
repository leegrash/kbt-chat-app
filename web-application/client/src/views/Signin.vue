<template>
  <div class="container">
    <div class="row clearfix">
      <div class="col-lg-12">
        <div class="card chat-app">
          <div class="chat">
            <h1 class="sign-in-header">Sign in</h1>
            <form
              class="sign-in-form align-items-center"
              @submit.prevent="authenticate()"
            >
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
              <div class="form-group input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><i class="bi bi-person-circle"></i
                  ></span>
                </div>
                <input
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
                <input
                  v-model="password"
                  type="password"
                  class="form-control"
                  placeholder="Password"
                />
              </div>
              <div class="form-group">
                <p>
                  Don't have an account?
                  <router-link to="/signup">Create one!</router-link>
                </p>
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
  name: "SigninView",
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
      const { commit } = this.$store;
      const { push } = this.$router;

      if (this.password === "" || this.username === "") {
        this.$store.state.msg = "Fill out all fields";
        return;
      }

      fetch("/api/signin", {
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
          commit("setAuthenticated", true);
          push("/chat");
        })
        .catch(console.error);
    },
  },
};
</script>
