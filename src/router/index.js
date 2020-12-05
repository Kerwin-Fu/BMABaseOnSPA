import Vue from "vue"
import VueRouter from "vue-router"
import Login from "../components/Login.vue"
import Home from "../components/Home.vue"
import Welcome from "../components/Welcome.vue"
import Users from "../components/user/Users.vue"
import Rights from "../components/Power/Rights.vue"
import Roles from "../components/Power/Roles.vue"
import Cates from "../components/goods/Cates.vue"
import Params from "../components/goods/Params.vue"
import Goods from "../components/goods/Goods.vue"
import Add from "../components/goods/Add.vue"

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: "/", redirect: "login" },
    { path: "/login", component: Login },
    { path: "/home",
      component: Home,
      redirect: '/welcome',
      children:[
        { path: '/welcome', component: Welcome},
        { path: '/users', component: Users},
        { path: '/rights', component: Rights},
        { path: '/roles', component: Roles},
        { path: '/categories', component: Cates},
        { path: '/params', component: Params},
        { path: '/goods', component: Goods},
        {
          // 注意这种写法和直接把 /add 当做 /goods 的子路由是不一样的
          path: '/goods/add',
          component: Add
        }

    ]},
  ],
});

router.beforeEach((to, from, next) => {
  //直接放行
  if (to.path == "/login") return next();
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  next();
});

export default router;
