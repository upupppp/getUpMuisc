<template>
  <div id="app" @click="outTap()">
    <div id="nav">
      <div id="nav-img">
        <img src="~@/assets/img/网易云音乐-03.png" alt="">
      </div>
      <div class="item"><router-link to="/recommend" class="text-color" >推荐</router-link></div>
      <div class="item"><router-link to="/rank" class="text-color">排行榜</router-link> </div>
      <div class="item"><router-link to="/rank" class="text-color">歌单</router-link></div>
      <div class="item"><router-link to="/rank" class="text-color">主播电台</router-link></div>
      <div class="item"><router-link to="/singer" class="text-color">歌手</router-link> </div>
      <div class="item"><router-link to="/newSongExpress" class="text-color">新碟上架</router-link> </div>
      <div class="search" @click.stop @keydown.enter="onSearch()">
        <!-- <input type="text" class="icon-search" value="">  -->
        <el-input
          :placeholder="placeholder"
          prefix-icon="el-icon-search"
          v-model="input"
          @focus="searchList()">
        </el-input>
        <div class="searchList" :class="{searchChange:searchType==2}" v-if="$store.state.searchFlag == true">
          <happy-scroll hide-horizontal :min-length-v="0.2">
          <div class="hotList" v-if="searchType == 1">
            <div class="search-history" v-if="searchHistory.length !== 0">
              <div class="title">
                <span>搜索历史</span>
                <span class="iconfont icon-lajitong lajitong" @click="onDeleteAll()"></span>
              </div>
              <div class="content">
                <div class="content-item" @click="toSearch(item)" v-for="(item,index) in searchHistory" :key="index">
                  {{item}}
                  <span class="el-icon-close close" @click.stop @click="onDelete(index)"></span>
                </div>
              </div>
            </div>
            <div class="hot-search">
              <div class="title">
                <span>热搜榜</span>
              </div>
              <div class="content">
                <div class="content-item" @click="toSearch(item.searchWord)" v-for="(item,index) in searchlist" :key="index">
                  <div class="index" :class="{top_index:index <=2}">
                    {{index+1}}
                  </div>
                  <div class="hot-item">
                    <div class="item-1">
                      <div :class="{top_item:index <=2}">
                        {{item.searchWord}}
                      </div>
                      <div v-if="index == 0">
                        <img :src="item.iconUrl" mode="widthFix" alt="">
                      </div>
                      <div>
                        {{item.score}}
                      </div>
                    </div>
                    <div class="item-2">
                      <div>{{item.content}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="suggest-list" v-if="searchType == 2&&suggestions">
            <div class="single" v-show="suggestions.songs">
              <div class="title">
                <span class="iconfont icon-yinle">
                </span>
                <span>
                  单曲
                </span>
              </div>
              <div class="content">
                <div class="content-item" @click="toSearch(item.name)" v-for="item in suggestions.songs" :key="item.id">
                  <span>{{item.name}}</span>
                  <span v-for="(item,index) in item.artists" :key="item.id">
                    {{index===0&&index?' - ':''}}{{item.name}}
                  </span>
                </div>
              </div>
            </div>
            <div class="singer" v-show="suggestions.artists">
              <div class="title">
                <span class="iconfont icon-yinle">
                </span>
                <span>
                  歌手
                </span>
              </div>
              <div class="content">
                <div class="content-item" @click="toSearch(item.name)" v-for="item in suggestions.artists" :key="item.id">
                  <span>{{item.name}}</span>
                </div>
              </div>
            </div>
            <div class="album" v-show="suggestions.albums">
              <div class="title">
                <span class="iconfont icon-yinle">
                </span>
                <span>
                  歌手
                </span>
              </div>
              <div class="content">
                <div class="content-item" @click="toSearch(item.name)" v-for="item in suggestions.albums" :key="item.id">
                  <span>{{item.name}}</span>
                  <span>
                     - {{item.artist.name}}
                  </span>
                </div>
              </div>
            </div>
            <div class="songList" v-show="suggestions.playlists">
              <div class="title">
                <span class="iconfont icon-yinle">
                </span>
                <span>
                  歌手
                </span>
              </div>
              <div class="content">
                <div class="content-item" @click="toSearch(item.name)" v-for="item in suggestions.playlists" :key="item.id">
                  <span>{{item.name}}</span>
                </div>
              </div>
            </div>
          </div>
          </happy-scroll>
        </div>
      </div>
      <div class="login-img">
        <!-- <img src="./assets/img/用户方形.png" alt=""> -->
        <el-avatar v-if="isLogin == 0" icon="el-icon-user-solid"></el-avatar>
        <router-link :to="{path: '/infoMsg', query: {id:info.userId,mine:true}}" class="text-color"><el-avatar v-if="isLogin == 1" icon="el-icon-user-solid" :src="info.avatarUrl"></el-avatar></router-link>
      </div>
      <!-- @click.stop 阻止冒泡事件 因为我在整个页面设置了 outTap点击事件会向下传播,加stop能让事件传播到stop这里就停止 -->
      <div class="item login" @click.stop v-if="isLogin == 0" @click="showLogin()">
        <p>未登录</p>
      </div>
      <div class="item login" @click.stop v-if="isLogin == 1">
        <p @click="showTap()" class="nickname">{{info.nickname}}<span class="el-icon-caret-bottom"></span></p>
        <div class="infoTap" v-show="infoTap">
          <div class="top">
            <div class="item1">
              <p>{{profile.eventCount}}</p>
              <p>动态</p>
            </div>
            <div class="item2">
              <p>{{profile.follows}}</p>
              <p>关注</p>
            </div>
            <div class="item3">
              <p>{{profile.followeds}}</p>
              <p>粉丝</p>
            </div>
          </div>
          <div class="content">
            <p @click="logout()"><span class="el-icon-switch-button"></span>退出登录</p> 
          </div>
        </div>
      </div>
      <router-link to="/singList"> </router-link>
    </div>
    <router-view/>
    
    <div class="loginBox">
      <loginTap @child-event="showInfo"></loginTap>
    </div>
    <div class="audio-box">
      <audioBox></audioBox>
    </div>
    <div class="footer"> 
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import audioBox from './components/audio.vue'
import loginTap from './components/loginTap.vue'
import { HappyScroll } from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'
// import { Router } from 'express'
export default {
  components:{
    audioBox,loginTap,'happy-scroll': HappyScroll,
  },
  data(){
    return{
      seller:{},
      currentSrc:'',
      isLogin:0,
      info:Object,
      infoTap:false,
      input:'',
      profile:Object,
      // 懂得都懂
      placeholder:null,
      // 搜索历史
      searchHistory:[],
      // 搜索列表
      searchlist:Object,
      searchHistory:[
        '薛之谦',
        '起风了',
        '章节',
        '王力宏',
        '爱情转移',
        '哈哈哈哈哈哈哈'
      ],
      // 搜索建议
      suggestions:Object,
      // 显示1：热搜榜还是2：搜索建议
      searchType:1,
    }
  },
  created() {
    this.$store.state.songList = JSON.parse(localStorage.getItem('songList'));
    if(sessionStorage.getItem('session')) {
      let session = JSON.parse(sessionStorage.getItem('session'));
    // let session = sessionStorage.getItem('session');
      this.$store.state.singer = session.singer;
      this.$store.state.singname = session.singname;
      this.$store.state.picUrl = session.picUrl;
      this.$store.state.musicID = session.musicID;
      this.$store.state.url = session.url;
      this.$store.state.flag = session.flag;
      this.$store.state.searchCurrentTap = session.searchCurrentTap;
      this.$store.state.currentTime = session.currentTime;
      this.$store.state.duration = session.duration;
      this.$store.state.songIndex = session.songIndex;
      this.$store.state.playType = session.playType;
      sessionStorage.removeItem('session');
    }
    this.searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
  },
  methods:{
    // onFocus() {
    //   this.searchFlag = true;
    //   if(this.input == '') {

    //   }

    // },
    toSearch(keywords) {
      this.input = keywords;
      this.onSearch();
    },
    onDelete(index) {
      this.infoTap = false;
      this.searchHistory.splice(index,1);
      localStorage.setItem('searchHistory',JSON.stringify(this.searchHistory));
    },
    onDeleteAll() {
      this.searchHistory = [];
      localStorage.setItem('searchHistory',JSON.stringify(this.searchHistory));
    },
    onSearch(){
      let has = null;
      this.$store.state.searchFlag = false;
      if(this.input == '') {
        this.input = this.placeholder;
      }
      // 查询搜索历史中是否有与input相同的,有就不添加没有就添加
      for(let i = 0; i < 1; i++) {
        for(let j = 0; j <= this.searchHistory.length - 1; j++) {
          if(this.searchHistory[j] == this.input) {
            has = true;
            break;
          }
        }
        if(has === null) {
          this.searchHistory.unshift(this.input);
          localStorage.setItem('searchHistory',JSON.stringify(this.searchHistory));
        }
      }
      this.$router.push({path:'/search', query: {keywords:this.input}})
    },
    showLogin() {
      this.$store.state.status = true;
    },
    showInfo(data) {
      // console.log('data',data);
      this.isLogin = 1;
      this.info = data;
      localStorage.setItem('info',JSON.stringify(this.info));
      localStorage.setItem('isLogin',1);
      localStorage.setItem('loginFlag',1);
    },
    getLocalStorage() {
      if(localStorage.getItem('loginFlag') == 1) {
      this.isLogin = localStorage.getItem('isLogin');
      this.info = JSON.parse(localStorage.getItem('info'));
      }
    },
    outTap() {
      // 阻止了事件冒泡 @click.stop
      this.infoTap = false;
      this.$store.state.searchFlag = false;
      this.$store.state.playListFlag = false;
    },
    showTap() {
      this.infoTap = !this.infoTap
    },
    logout() {
      let _this = this;
      this.infoTap == false;
      axios.get('http://localhost:3000/logout').then((res)=>{
          console.log('logout:',res);
          localStorage.removeItem("isLogin");
          localStorage.removeItem("info");
          localStorage.removeItem("loginFlag");
          localStorage.removeItem("cookie");
          _this.isLogin = 0;
          this.$store.state.loginStatus = 0;
      });
      axios.get('http://localhost:3000/login/status').then((res)=>{
          console.log('loginStatus:',res);
      });
      this.$router.push({path: '/recommend'});
      
    },
    beforeunloadHandler(e) {
      // e = e || window.event;
      // if (e) {
      //   e.returnValue = "您是否确认离开此页面-您输入的数据可能不会被保存";
      // }
      // return "您是否确认离开此页面-您输入的数据可能不会被保存";
      const session = {
        singer:this.$store.state.singer,
        singname:this.$store.state.singname,
        picUrl:this.$store.state.picUrl,
        musicID:this.$store.state.musicID,
        url:this.$store.state.url,
        flag:this.$store.state.flag,
        currentTime:this.$store.state.audioMedia.currentTime,
        duration:this.$store.state.duration,
        // musicPlay:this.$store.state.musicPlay,
        searchCurrentTap:this.$store.state.searchCurrentTap,
        songIndex:this.$store.state.songIndex,
        playType:this.$store.state.playType,
      }
      sessionStorage.setItem('session',JSON.stringify(session));
      localStorage.setItem('songList',JSON.stringify(this.$store.state.songList));
    },
    searchList() {
      this.$store.state.searchFlag = true;
      this.infoTap = false;
      if(this.input == '') {
        axios({
        url:'/search/hot/detail'
        }).then(res=>{
          console.log('搜索列表详情',res);
          this.searchlist = res.data.data;
        })
        return;
      }
      axios({
        url:`/search/suggest?keywords=${this.input}`
      }).then(res=>{
        if(res.data.result.order) {
          this.suggestions = res.data.result;
        }
        console.log('搜索建议',res.data.result);
      })
    }
  },
  mounted(){
    this.getLocalStorage();
    window.addEventListener("beforeunload", e => {
      this.beforeunloadHandler(e);
    });
    axios.get('/user/detail?uid='+ this.info.userId +'').then((res)=>{
      this.profile = res.data.profile;
    });
    axios({
      url:'/search/default',
    }).then(res=> {
      this.placeholder = res.data.data.showKeyword;
      console.log(res);
    })
  },
  watch:{
    input() {
      console.log('正在敲');
      if(this.input == '') {
        // setTimeout(()=> {
        //   this.searchType = 1
        // },500)
          this.searchType = 1
      } else {
        this.searchType = 2;
      }
      this.searchList();
    }
  },
  destroyed() {
    window.removeEventListener("beforeunload", e => {
      this.beforeunloadHandler(e);
    });
  }
}
</script>
<style lang="scss" scoped>
@import './assets/styles/index';
#app{
  width: 100%;
  margin: 0 auto;
  // overflow-y: scroll;
  #nav{
    // width: 1915px;
    display: flex;
    background: rgba(0, 0, 0, 0.815);
    justify-content: center;
    #nav-img img{
      width: 80px;  
      height: 80px;  
    }
    .search {
      position: relative;
      .el-input {
        height: 35px;
        border-radius: 40px;
        margin: 20px 25px;
        width: 190px;
      }
      .icon-search {
        background-image: url('/assets/img/搜索.png');
        background-size: 25px 25px;
      }
      .searchChange {
        width: 530px !important;
        // transform:width(510px);
      }
      .searchList {
        transition:width .5s;
        transition-delay: .25s;
        position: absolute;
        left: -100px;
        width: 468px;
        height: 700px;
        background-color: white;
        z-index: 998;
        box-shadow:  0 0 3px rgba(0, 0, 0, 0.257);
        .search-history {
          width: 468px;
          margin: 0 auto;
          padding-top: 20px;
          margin-left: 20px;
          // height: 300px;
          // background: blueviolet;
          .title {
            &>span {
              color: $b-second;
              font-weight: 100;
              vertical-align: middle;
              font-size: 22px;
            }
            &>span:last-child {
              font-size: 25px;
            }
            .lajitong:hover{
              color: black;
              font-weight: 400;
              cursor: pointer;
            }
          }
          .content {
            margin-top: 10px;
            // height: 200px;
            // background: brown;
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            &>div {
              cursor: pointer;
              color: $b-first;
              font-weight: 400;
              position: relative;
              margin-bottom: 10px;
              margin-top: 5px;
              padding: 0px 20px;
              margin-right: 20px;
              height: 35px;
              // background: burlywood;
              border: 1px solid $bd-first;
              border-radius: 20px;
              text-align: center;
              line-height: 35px;
              // padding-right: 20px;
              .close {
                display: none;
                position: absolute;
                right: 3px;
                top: 10px;
                // background: black;
              }
              &:hover {
                background: rgba(128, 128, 128, 0.123);
              }
              &:hover .close {
                display: block;
                z-index: 999;
              }
            }
          }
        }
        .hot-search {
          margin: 0 auto;
          margin-top: 30px;
          // width: 90%;
          .title {
            margin-left: 25px;
            span {
              color: $b-second;
              font-weight: 100;
              vertical-align: middle;
              font-size: 22px;
            }
              
          }
          .content {
            padding-bottom: 30px;
            margin-top: 30px;
            // background: grey;
            .content-item {
              padding: 10px;
              display: flex;
              height: 50px;
              cursor: pointer;
              &:hover {
                background: rgba(128, 128, 128, 0.123);
              }
              // border: 1px solid palevioletred;
              .index {
                height: 50px;
                width: 50px;
                text-align: center;
                line-height: 50px;
                font-size: 20px;
                margin-right: 10px;
                // background: papayawhip;
              }
              .top_index {
                  color:#EC4444;
                }
              .hot-item {
                font-size: 16px;
                .item-1 {
                  .top_item {
                    font-weight: 700;
                    color: black;
                    font-size: 18px;
                  }
                  display: flex;
                  
                  &>div {
                    margin-right: 10px;
                  }
                  img {
                    width: 30px;
                  }
                  &>div:last-child {
                    color: $b-fourth;
                    font-weight: 100;
                  }
                }
                .item-2 {
                  margin-top: 15px;
                  color: $b-third;
                }
              }
            }
          }
        }
        .suggest-list {
          margin-top: 30px;
          padding-right: 50px;
          .single {
            .title {
            margin-left: 15px;
            &>span {
              font-size: 20px;
              color: $b-third;
            }
          }
          .content {
            cursor: pointer;
            padding: 25px 0px;
            width: 530px;
            .content-item {
              // width: 448px;
              @extend %overflow;
                padding: 15px;
                padding-left: 40px;
                &:hover {
                background: rgba(128, 128, 128, 0.123);
                }
            }
          }
          }
          .singer {
            @extend .single;
          }
          .album {
            @extend .single;
          }
          .songList {
            @extend .single;
          }
        }
      }
    }
    .item{
      text-align: center;
      font-size: 16px;
      padding: 30px 25px 30px 25px;
      &:hover {
        background: black;
      }
      .text-color {
        color:white;
      }
    }
    .login {
      // background: red;
      color: white;
      p {
        cursor: pointer;
      }
      &:hover {
        background: none;
      }
      .infoTap {
        width: 400px;
        height: 400px;
        position: absolute;
        right: 15%;
        // background: blueviolet;
        background: white;
        z-index: 999;
        top: 80px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        .top {
          display: flex;
          color: black;
          height: 120px;
          // background: blueviolet;
          margin: 0 auto;
          width: 90%;
          &>div {
            width: 33%;
            margin-top: 30px;
            p {
              // cursor: pointer;
              font-size: 20px;
              margin-top: 5px;
            }
          }
        }
        .content {
          width: 100%;
          color: black;
          // background: brown;
          margin: 0 auto;
          text-align: left;
          p {
            padding-left: 35px;
            font-size: 20px;
            margin-right: 10px;
            height: 60px;
            line-height: 60px;
            &:hover {
              background: rgba(128, 128, 128, 0.123);
            }
            span {
              font-size: 20px;
              margin-right: 5px;
            }
          }
        }
      }
    }
    .login-img {
      cursor: pointer;
      position: relative;
      margin-left: 100px !important;
      height: 40px;
      margin: 0px;
      padding: 0px;
      top: 20px;
      img {
        width: 35px;
        border-radius: 50%;
      }
    }
}
.loginBox {
  position: fixed;
  top: 100px;
  left: 40%;
  z-index: 999;
  // &:focus
}
.footer{
  position:relative;
  bottom: 0px;
  background: red;
  width: 100%;
  height: 200px;
  display: none;
}
}

</style>
