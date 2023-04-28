<template>
  <head> </head>

  <div class="row">
    <div class="col"></div>

    <!-- .prevent prevents the submit action and instead calls the function -->
    <form class="col" @submit.prevent="authenticate()">
      <div
        v-if="msg === 'Bad credentials'"
        role="alert"
        aria-live="polite"
        aria-atomic="true"
        class="alert text-center alert-danger"
      >
        <!---->
        Bad credentials
      </div>

      <label for="username" class="form-label h4">What is Your name?</label>
      <input
        id="username"
        v-model="username"
        type="text"
        class="form-control"
        placeholder="username..."
        required
      />
      <label for="password" class="form-label h4">What is Your password?</label>
      <input
        id="password"
        v-model="password"
        type="password"
        class="form-control"
        placeholder="password..."
        required
      />
      <button type="submit" class="btn btn-dark mt-4 float-end">Login</button>
    </form>
    <div class="col"></div>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  data: () => ({
    username: "",
    password: "",
    msg: "",
  }),
  methods: {
    authenticate() {
      const { commit } = this.$store;
      const { push } = this.$router;

      fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      })
        .then((res) => {
          if (res.status === 200) return res.json();

          this.msg = "Bad credentials";
          throw new Error("Authentication failed");
        })
        .then(({ authenticated }) => {
          this.msg =
            authenticated === true ? "Login successful" : "Bad credentials";
          commit("setAuthenticated", authenticated);
          commit("setUsername", this.username);
          push(authenticated === true ? "/admin" : "/login");
        })
        .catch(console.error);
    },
  },
};
</script>
