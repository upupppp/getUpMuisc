import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 存储状态（变量）
  state: {
    songId:1858811233,
    flag:false,
    url:'',
    cookie:null,
    song:{},
    musicPlay:false,
    singerListImg:null,
    singer:null,
    picUrl:null,
    singname:null,
    imgUrl:null,
    loginStatus:0,
    // newSong
    type:0,
    area:'ALL',
    status:false,
    musicID:null,
    // 音乐播放器
    audioMedia:null,
    // 刷新页面时赋值实时时间
    currentTime:null,
    // 刷新页面音乐播放总时长
    duration:null,
    // 搜索页面alive的作用
    searchCurrentTap:1,
    // 播放列表
    songList:Array,
    // 音乐id用于上下首音乐
    songIndex:0,
    // 控制播放列表是否出现
    playListFlag:false,
    // 播放类型 1为顺序播放 2为随机播放 3为单曲循环
    playType:1,
    // 搜索建议是否出现
    searchFlag:false,
  },
  // 对数据获取之前的再次编译，可以理解为state的计算属性。我们在组件中使用 $sotre.getters.fun()
  getters: {

  },
  // singer: {
  //   // imgUrl:null,
  // },
  // 修改状态，并且是同步的。在组件中使用$store.commit('',params)。这个和我们组件中的自定义事件类似。
  mutations: {
    musicPlay(state,payload) {
      // 负责获取播放地址 图片，歌名，歌手名字，音乐id，当前播放索引
      state.url = payload.url;
      state.picUrl = payload.item.al.picUrl;
      state.singname = payload.item.name
      if(payload.item.ar) {
        state.singer = payload.item.ar[0].name;
      }
      else {
        state.singer = payload.item.artists[0].name;
      }
      // state.musicPlay = true;
      state.musicID = payload.item.id;
      if(payload.index) {
        state.songIndex = payload.index;
      }


      // type:1是将整个数组赋值给songList,2是一首歌unshift进songList
      // 并且两种放进来的后端数据不一样,所以才要这个type
      // if(payload.type == 1) {
      //   // 负责获取播放地址 图片，歌名，歌手名字，音乐id，当前播放索引
      //   state.url = payload.url;
      //   state.picUrl = payload.item.al.picUrl;
      //   state.singname = payload.item.name
      //   if(payload.item.ar) {
      //     state.singer = payload.item.ar[0].name;
      //   }
      //   else {
      //     state.singer = payload.item.artists[0].name;
      //   }
      //   // state.musicPlay = true;
      //   state.musicID = payload.item.id;
      //   if(payload.index) {
      //     state.songIndex = payload.index;
      //   }
      // }
      // if(payload.type == 2) {
      //   state.url = payload.url;
      //   state.picUrl = payload.item.picUrl;
      //   state.singname = payload.item.name;
      //   state.singer = payload.item.artists[0].name;
      //   state.musicID = payload.item.id;
      //   state.songIndex = payload.index;
      // }
      // state.playListFlag = true;
    }
  },
  // 异步操作。在组件中使用是$store.dispath('')
  actions: {
  },
  // store的子模块，为了开发大型项目，方便状态管理而使用的。这里我们就不解释了，用起来和上面的一样。
  modules: {
  }
})
