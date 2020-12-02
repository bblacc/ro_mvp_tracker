import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'
import Settings from '@/components/Settings'
import Mvptracker from '@/components/Mvptracker'
import Privacy from '@/components/Privacy'
import About from '@/components/About'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '*',
            redirect: '/dashboard'
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: Dashboard,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/settings',
            name: 'Settings',
            component: Settings,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/mvptracker',
            name: 'Mvptracker',
            component: Mvptracker,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/privacy',
            name: 'Privacy',
            component: Privacy,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/about',
            name: 'About',
            component: About,
            meta: {
                requiresAuth: true
            }
        },
    ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = firebase.auth().currentUser

  if (requiresAuth && !currentUser) {
      next('/login')
  } else if (requiresAuth && currentUser) {
      next()
  } else {
      next()
  }
})

export default router