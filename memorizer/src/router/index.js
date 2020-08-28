import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import LinkInput from '../components/LinkInput.vue'
import QAInput from '../components/QAInput.vue'
import Login from '../views/Login.vue'
import Memory from '../views/Memory.vue'
import Revision from '../views/Revision.vue'
import Donezo from '../components/Donezo.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: 'link',
        name: 'Link',
        component: LinkInput
      },
      {
        path: 'qa',
        name: 'QA',
        component: QAInput
      }
    ]
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/memory/:uid',
    name: 'Memory',
    component: Memory
  },
  {
    path: '/revision/:id',
    name: 'Revision',
    component: Revision
  },
  {
    path: '/done',
    name: "Donezo",
    component: Donezo
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
