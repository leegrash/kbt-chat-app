<template>
  <div class="container">
  <div class="row clearfix">
      <div class="col-lg-12">
          <div class="card chat-app">
              <div class="chat">
                <h1 class="sign-in-header">Sign up</h1>
                <form class="sign-in-form" @submit.prevent="createUser()">
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
                  <div class="form-group input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text"><i class="bi bi-person-circle"></i></span>
                    </div>
                    <input v-model="username" type="text" class="form-control" placeholder="Username">
                  </div>                  
                  <div class="form-group input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
                    </div>
                    <input v-model="password" type="password" class="form-control" placeholder="Password">
                    <small class="form-text text-muted">Password must be longer than 5 characters and include at least 1 number</small>
                  </div>
                  <div class="form-group input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text"><i class="bi bi-lock"></i></span>
                    </div>
                    <input v-model="confirmPassword" type="password" class="form-control" placeholder="Confirm password">
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
  name: "LoginView",
  data: () => ({
    username: "",
    password: "",
    confirmPassword: "",
  }),
  methods: {
    createUser() {
      if (this.password !== this.confirmPassword) {
        this.$store.state.msg = "Passwords don't match";
        return;
      }
      if (this.password.length < 5 || !/\d/.test(this.password)) {
        this.$store.state.msg = "Password requirements not met";
        return;
      }
      this.$store.state.msg = "";
      console.log("Creating user");
      this.$router.push("/login");
    }
  },
};
</script>
