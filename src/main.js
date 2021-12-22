import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/fonts/iconfont.css'
import VueLazyLoad from 'vue-lazyload'
import "vue-virtual-scroller/dist/vue-virtual-scroller.css"
import VueVirtualScroller from "vue-virtual-scroller" 
import axios from "axios"
axios.defaults.baseURL = 'http://localhost:3000'
// import axios from './data/http'
// var compression = require('compression');
// var app = express();
// app.use(compression())
Vue.use(VueVirtualScroller) 


import { Slider } from 'vant';
import { Radio } from 'vant';
import 'vant/lib/button/style';
import 'vant/lib/radio/style';
Vue.use(Slider);
Vue.use(Radio );

// ui
import {
  Icon,
  Tag,
  Pagination,
  Avatar,
  Loading,
  Dropdown,
  Tooltip,
  Carousel,
  Image,
  InfiniteScroll,
  MessageBox,
  Message,
  Drawer
} from 'element-ui';
Vue.use(Icon);
Vue.use(Tag);
Vue.use(Pagination);
Vue.use(Avatar);
Vue.use(Loading);
Vue.use(Dropdown);
Vue.use(Tooltip);
Vue.use(Carousel);
Vue.use(Image);
Vue.use(Drawer);
Vue.use(InfiniteScroll);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$notify = Notification;
Vue.use(ElementUI);
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
