import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由懒加载
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const Layout = () => import('../views/Layout.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const PostList = () => import('../views/posts/PostList.vue')
const PostEdit = () => import('../views/posts/PostEdit.vue')
const PostCreate = () => import('../views/posts/PostCreate.vue')
const TagList = () => import('../views/tags/TagList.vue')
const Profile = () => import('../views/Profile.vue')

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'posts',
        name: 'PostList',
        component: PostList
      },
      {
        path: 'posts/create',
        name: 'PostCreate',
        component: PostCreate
      },
      {
        path: 'posts/edit/:slug',
        name: 'PostEdit',
        component: PostEdit,
        props: true
      },
      {
        path: 'tags',
        name: 'TagList',
        component: TagList
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile
      }
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 需要认证的路由
    if (!token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    // 不需要认证的路由
    if (token && (to.path === '/login' || to.path === '/register')) {
      next({ path: '/' })
    } else {
      next()
    }
  }
})

export default router 