import Vue from 'vue'
import VueRouter from 'vue-router'
import recommend from '../components/recommend.vue'
import rank from '../components/rank.vue'
import playlist from '../components/playlist.vue'
import radioAnchor from '../components/radioAnchor.vue'
import singer from '../components/singer.vue'
import newSong from '../components/newSong.vue'
import singList from '../components/singList.vue'
import singerDetail from '../components/singerDetail.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/recommend',
    name: 'recommend',
    component: recommend
  },
  {
    path: '/rank',
    name: 'rank',
    component: rank
  },
  {
    path: '/playlist',
    name: 'playlist',
    component: playlist
  },
  {
    path: '/radioAnchor',
    name: 'radioAnchor',
    component: radioAnchor
  },
  {
    path: '/singer',
    name: 'singer',
    component: singer
  },
  {
    path: '/newSong',
    name: 'newSong',
    component: newSong
  },
  {
    path: '/singList',
    name: 'singList',
    component: singList
  },
  {
    path: '/singerDetail',
    name: 'singerDetail',
    component: singerDetail
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
