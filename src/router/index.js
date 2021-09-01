import Vue from 'vue'
import VueRouter from 'vue-router'
// import recommend from '../components/recommend.vue'
// import rank from '../components/rank.vue'
// import playlist from '../components/playlist.vue'
// import radioAnchor from '../components/radioAnchor.vue'
// import singer from '../components/singer.vue'
// import newSong from '../components/newSong.vue'
// import singList from '../components/singList.vue'
// import singerDetail from '../components/singerDetail.vue'

// 路由懒加载
const recommend = () => import('../components/recommend')
const rank = () => import('../components/rank')
const playlist = () => import('../components/playlist')
const radioAnchor = () => import('../components/radioAnchor')
const singer = () => import('../components/singer')
const newSong = () => import('../components/newSong')
const singList = () => import('../components/singList')
const singerDetail = () => import('../components/singerDetail')

Vue.use(VueRouter)
const routes = [
  {
    path: '',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: recommend
  },
  {
    path: '/rank',
    component: rank
  },
  {
    path: '/playlist',
    component: playlist
  },
  {
    path: '/radioAnchor',
    component: radioAnchor
  },
  {
    path: '/singer',
    component: singer
  },
  {
    path: '/newSong',
    component: newSong
  },
  {
    path: '/singList',
    component: singList
  },
  {
    path: '/singerDetail',
    component: singerDetail
  },
]


// const routes = [
//   {
//     path: '/recommend',
//     name: 'recommend',
//     component: recommend
//   },
//   {
//     path: '/rank',
//     name: 'rank',
//     component: rank
//   },
//   {
//     path: '/playlist',
//     name: 'playlist',
//     component: playlist
//   },
//   {
//     path: '/radioAnchor',
//     name: 'radioAnchor',
//     component: radioAnchor
//   },
//   {
//     path: '/singer',
//     name: 'singer',
//     component: singer
//   },
//   {
//     path: '/newSong',
//     name: 'newSong',
//     component: newSong
//   },
//   {
//     path: '/singList',
//     name: 'singList',
//     component: singList
//   },
//   {
//     path: '/singerDetail',
//     name: 'singerDetail',
//     component: singerDetail
//   },
// ]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
