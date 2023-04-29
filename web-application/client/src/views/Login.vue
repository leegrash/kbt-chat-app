<template>
  <div class="container">
  <div class="row clearfix">
      <div class="col-lg-12">
          <div class="card chat-app">
              <div class="chat">
                <h1 class="sign-in-header">Sign in</h1>
                <form action="" class="sign-in-form align-items-center">
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
                    Passwords don't match
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
                      <span class="input-group-text"><i class="bi bi-person-circle"></i></span>
                    </div>
                    <input type="email" class="form-control" placeholder="Username">
                  </div>                  
                  <div class="form-group input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
                    </div>
                    <input type="password" class="form-control" placeholder="Password">
                  </div>
                  <div class="form-group">
                    <p>Don't have an account? <router-link to="/signup">Create one!</router-link></p>
                  </div>
                  <button type="submit" class="btn btn-primary">Login</button>
                </form>
              </div>
          </div>
      </div>
  </div>
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

      if (this.password==="" || this.username==="" || this.confirmPassword==="") {
        this.$store.state.msg = "Fill out all fields";
        return;
      }

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
