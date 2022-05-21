import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import DataView from "../views/DataView.vue";
import SignUpView from "../views/SignUpView.vue";

export const publicPages = ["login", "signup"];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "data",
      component: DataView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/signup",
      name: "signup",
      component: SignUpView,
    },
    // otherwise redirect to /
    {
      path: "/:catchAll(.*)",
      redirect: "/",
    },
  ],
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const authRequired = !publicPages.includes(to.name);
  const loggedIn = localStorage.getItem("token");

  if (authRequired && !loggedIn) {
    return next({
      path: "/login",
      query: { returnUrl: to.path },
    });
  }

  next();
});

export default router;
