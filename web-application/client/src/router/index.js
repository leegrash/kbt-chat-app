import { createRouter, createWebHistory } from "vue-router";
import Signin from "../views/Signin.vue";
import Chat from "../views/Chat.vue";
import Signup from "../views/Signup.vue";
import SurveyInfo from "../views/SurveyInfo.vue";
import PsychologistSignIn from "../views/PsychologistSignin.vue";
import PsychologistChatOverview from "../views/PsychologistChatOverview.vue";

const routes = [
  {
    path: "/",
    redirect: "/survey-info",
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
  {
    path: "/survey-info",
    component: SurveyInfo,
  },
  {
    path: "/psychologist-signin",
    component: PsychologistSignIn,
  },
  {
    path: "/psychologist-overview",
    component: PsychologistChatOverview,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
