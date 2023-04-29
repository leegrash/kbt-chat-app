import { createRouter, createWebHistory } from "vue-router";
import Signin from "../views/Signin.vue";
import Chat from "../views/Chat.vue";
import Signup from "../views/Signup.vue";

const routes = [
  {
    path: "/",
    redirect: "/chat",
  },
  {
    path: "/signin",
    component: Signin,
  },
  {
    path: "/chat",
    component: Chat,
  },
  {
    path: "/signup",
    component: Signup,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
