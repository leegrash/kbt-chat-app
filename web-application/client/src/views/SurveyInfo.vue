<template>
    <div class="container">
      <div class="row clearfix">
        <div class="col-lg-12">
          <div class="card chat-app">
            <div class="chat-info">
                <h1 class="page-title">Information about survey</h1>
                <div class="row page-content">
                    <h2>Chatbot#1</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <button type="button" class="btn btn-primary" @click="redirect('/chat', 'Closed')">Try Chatbot#1</button>
                </div>
                <div class="row page-content">
                    <h2>Chatbot#2</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <button type="button" class="btn btn-primary" @click="redirect('/chat', 'Open')">Try Chatbot#2</button>
                </div>
                <div class="row page-content">
                    <h2>Chatbot#3</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <button type="button" class="btn btn-primary" @click="redirect('/chat', 'Mixed')">Try Chatbot#3</button>
                </div>
                <div class="row page-content">
                    <h2>Survey form</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <a href="#" target="_blank" class="btn btn-primary">Fill out the survey form <i class="bi bi-box-arrow-up-right"></i></a>
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
    name: "SurveryInfoView",
    components: {},
    beforeRouteLeave(to, from, next) {
        this.socket.disconnect();
        next();
    },
    data: () => ({
      socket: io.connect(),
    }),
  
    mounted() {
    },
    created() {},
    methods: {
      redirect(target, version=null) {
      if (version==null) {
        this.$router.push(target); 
      }
      else {
        this.$store.state.version = version;
        this.$router.push(target);
      }
    },
    },
  };
  </script>
  