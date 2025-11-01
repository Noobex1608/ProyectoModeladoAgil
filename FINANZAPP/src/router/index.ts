import { createRouter, createWebHistory } from "vue-router"
import homepage from "../pages/homepage.vue"
import LoginPage from "../pages/LoginPage.vue";

const routes = [
  {
    path: "/",
    name: "Homepage",
    component: homepage,
    meta: { requiresAuth: false },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: { requiresAuth: false },
  },
];


const router =  createRouter({
    history:  createWebHistory(),
    routes
})

export default router