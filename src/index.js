import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueRouter from 'vue-router'

const App = () => import("./App.vue");
const AppHome = () => import("./components/AppHome.vue");
const MyNFTs = () => import("./components/MyNFTs.vue");
const TokenDetail = () => import("./components/TokenDetail.vue");

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
// Vue.use(IconsPlugin)

Vue.use(VueRouter)

const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

const routes = [
  { path: '/lowb-market', component: AppHome },
  { path: '/lowb-market/foo', component: Foo },
  { path: '/lowb-market/bar', component: Bar },
  { path: '/lowb-market/my-nfts', component: MyNFTs },
  { path: '/lowb-market/token-details/:id', component: TokenDetail }
]

const router = new VueRouter({
  mode: 'history',
  routes // (缩写) 相当于 routes: routes
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})