import Vue from 'vue'
import Router from 'vue-router'
import communicate from './util/communicate'
Vue.use(Router)

const routes = [
    {
        path: '/register',
        name: '/register',
        component: () => import('./views/Register.vue')
    },
    {
        path: '/login',
        name: 'Login',
        redirect: '/'
    },
    {
        path: '/',
        name: 'Main',
        component: () => import('./views/Login.vue')
    },
    {
        path: '/Home',
        name: 'Home',
        component: () => import('./views/Home.vue'),
        children: [{
            path: 'Log',
            name: 'Log',
            component: () => import('./views/Log.vue')
        },
        {
            path: 'Profile',
            name: 'Profile',
            component: () => import('./views/Profile.vue')
        }, {
            path: 'Createsurvey',
            name: "CreateSurvey",
            component: () => import('./views/CreateSurvey.vue')
        }
        ],
        meta: { requiresAuth: true }
    }

]

const router = new Router({
    mode: 'history',
    base: process.env.VUE_APP_BASE_URL,
    routes
})

router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        await communicate.verify()
        if (localStorage.getItem("token") == null) {
            next({ path: '/' })
        } else {
            next()
        }
    } else {
        if (localStorage.getItem("token") != null) {
            if (to.path === "/" || to.path === '/register') {
                next({ path: '/Home/Log' })
            } else {
                next()
            }
        }
        next()
    }
})

export default router