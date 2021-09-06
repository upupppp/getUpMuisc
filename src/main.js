import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/fonts/iconfont.css'
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad,{
  loading:require("./assets/img/用户方形.png"),
  Error:'./assets/img/用户方形.png'
})
Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
