import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import ShowTimeslots from "../views/ShowTimeslots.vue";

const routes = [
  {
    path: "/",
    redirect: "/showtimeslots",
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/showtimeslots",
    component: ShowTimeslots,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
