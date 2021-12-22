import Vue from 'vue'
import VueRouter from 'vue-router'
// 路由懒加载
const recommend = () => import('../components/recommend')
const rank = () => import('../components/rank')
// const playlist = () => import('../components/playlist')
// const radioAnchor = () => import('../components/radioAnchor')
const singer = () => import('../components/singer/singer')
const newSong = () => import('../components/newsong/newSong')
const singList = () => import('../components/singList')
const singerDetail = () => import('../components/singerDetail/singerDetail')
const artist = () => import('../components/singerDetail/artist')
const MV = () => import('../components/singerDetail/MV')
const album = () => import('../components/singerDetail/album')
const detail = () => import('../components/singerDetail/detail')
const Slist = () => import('../components/singer/Slist')
const mvSon = () => import('../components/mvSon')
const infoMsg = () => import('../components/info/infoMsg')
const music = () => import('../components/musicDetail/musicDetail')
const changeInfo = () =>import('../components/info/changeInfo')
const search = () =>import('../components/search/search')
const newSongExpress = () => import('../components/newsong/newSongExpress')
const newDiscGrounding = () => import('../components/newsong/newDiscGrounding')
const singerAlbum = () => import ('../components/singerAlbum')
Vue.use(VueRouter)
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}
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
  // {
  //   path: '/playlist',
  //   component: playlist
  // },
  // {
  //   path: '/radioAnchor',
  //   component: radioAnchor
  // },
  {
    path: '/singer',
    component: singer,
  },
  {
    path: '/Slist',
    component: Slist
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
    path:'/mvSon',
    component:mvSon,
  },
  {
    path: '/singerDetail',
    component: singerDetail,
    children:[
      {
        path: '',
        redirect: '/singerDetail/album'
      },
      {
        path:'/singerDetail/album',
        component:album,
      },
      {
        path:'/singerDetail/detail',
        component:detail,
      },
      {
        path:'/singerDetail/MV',
        component:MV,
      },
      {
        path:'/singerDetail/artist',
        component:artist,
      },
    ]
  },
  {
    path:'/infoMsg',
    component:infoMsg,
  },
  {
    path:'/changeInfo',
    component:changeInfo,
  },
  {
    path:'/musicDetail',
    component:music,
  },
  {
    path:'/search',
    component:search,
  },
  {
    path: '/newsong',
    component: newSong,
    children:[
      {
        path:'',
        redirect:'/newSongExpress'
      },
      {
        path:'/newSongExpress',
        component:newSongExpress
      },
      {
        path:'/newDiscGrounding',
        component:newDiscGrounding
      }
    ]
  },
  {
     path:'/singerAlbum',
     component:singerAlbum
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
