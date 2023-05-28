import { createRouter, createWebHistory } from "vue-router";
import Signin from "../views/Signin.vue";
import Chat from "../views/Chat.vue";
import Signup from "../views/Signup.vue";
import SurveyInfo from "../views/SurveyInfo.vue";
import PsychologistSignIn from "../views/PsychologistSignin.vue";
import PsychologistChatOverview from "../views/PsychologistChatOverview.vue";
import PsychologistChat from "../views/PsychologistChat.vue";

const routes = [
  {
    path: "/",
    redirect: "/signup",
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
  {
    path: "/psychologist-chat/:conversation/:user",
    component: PsychologistChat,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
