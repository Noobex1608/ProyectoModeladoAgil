import { createRouter, createWebHistory } from "vue-router"
import homepage from "../pages/homepage.vue"




const routes = [
    {
        path: '/',
        name: 'Homepage',
        component: homepage,
        meta: {requiresAuth: false
        }
    }
]


const router =  createRouter({
    history:  createWebHistory(),
    routes
})

export default router