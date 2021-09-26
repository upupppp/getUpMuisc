<template>
  <div id="app">
    <div id="nav">
      <div id="nav-img">
        <img src="~@/assets/img/网易云音乐-03.png" alt="">
      </div>
      <div class="item"><router-link to="/recommend" class="text-color" >推荐</router-link></div>
      <div class="item"><router-link to="/rank" class="text-color">排行榜</router-link> </div>
      <div class="item"><router-link to="/playlist" class="text-color">歌单</router-link></div>
      <div class="item"><router-link to="/radioAnchor" class="text-color">主播电台</router-link></div>
      <div class="item"><router-link to="/singer" class="text-color">歌手</router-link> </div>
      <div class="item"><router-link to="/newSong" class="text-color">新碟上架</router-link> </div>
      <div class="login-img">
        <!-- <img src="./assets/img/用户方形.png" alt=""> -->
        <el-avatar v-if="isLogin == 0" icon="el-icon-user-solid"></el-avatar>
        <router-link :to="{path: '/infoMsg', query: {id:info.userId,mine:true}}" class="text-color"><el-avatar v-if="isLogin == 1" icon="el-icon-user-solid" :src="info.avatarUrl"></el-avatar></router-link>
      </div>
      <div class="item login" v-if="isLogin == 0" @click="showLogin()">
        未登录
      </div>
      <div class="item login" v-if="isLogin == 1">
        <p @click="showTap()">{{info.nickname}}<span class="el-icon-caret-bottom"></span></p>
        <div class="infoTap" v-show="infoTap">
          <div class="top">
            <div class="item1">
              <p>0</p>
              <p>动态</p>
            </div>
            <div class="item2">
              <p>58</p>
              <p>关注</p>
            </div>
            <div class="item3">
              <p>7</p>
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
import sass from './assets/styles/index.scss'
export default {
  components:{
    audioBox,loginTap
  },
  data(){
    return{
      seller:{},
      currentSrc:'',
      isLogin:0,
      info:Object,
      infoTap:false,
    }
  },
  created() {
  },
  methods:{
    showLogin() {
      this.$store.state.status = true;
    },
    showInfo(data) {
      console.log('data',data);
      this.isLogin = 1;
      this.info = data;
      localStorage.setItem('info',JSON.stringify(this.info));
      localStorage.setItem('isLogin',1);
      localStorage.setItem('loginFlag',1);
      console.log('str',getItem('loginFlag'));
    },
    getLocalStorage() {
      let _this = this;
      if(localStorage.getItem('loginFlag') == 1) {
      this.isLogin = localStorage.getItem('isLogin');
      this.info = JSON.parse(localStorage.getItem('info'));
      console.log(this.info);
      console.log(localStorage.getItem('loginFlag'));
      axios.get('https://autumnfish.cn/user/binding?uid='+ _this.info.userId +'').then((res)=>{
      // this.personalized = res.data.result;
          console.log('detail:',res);
      });
      }
      
    },
    showTap() {
      this.infoTap = !this.infoTap;
      console.log(this.infoTap);
    },
    logout() {
      let _this = this;
      axios.get('https://autumnfish.cn/logout').then((res)=>{
          console.log('logout:',res);
          localStorage.removeItem("isLogin");
          localStorage.removeItem("info");
          localStorage.removeItem("loginFlag");
          _this.isLogin = 0;
      });
      axios.get('https://autumnfish.cn/login/status').then((res)=>{
          console.log('loginStatus:',res);
      });
    }
  },
  mounted(){
    this.getLocalStorage();
  }

}
</script>
<style lang="scss" scoped>
#app{
  width: 100%;
  margin: 0 auto;
  #nav{
    width: 100%;
    display: flex;
    background: rgba(0, 0, 0, 0.815);
    justify-content: center;
    #nav-img img{
      width: 80px;  
      height: 80px;  
    }
    .item{
      text-align: center;
      padding: 30px 25px 30px 25px;
      &:hover {
        background: black;
      }
      .text-color {
        color:white;
      }
    }
    .login {
      cursor: pointer;
      color: white;
      &:hover {
        background: none;
      }
      .infoTap {
        width: 400px;
        height: 400px;
        position: absolute;
        right: 20%;
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
