<template>
  <div class="loginTap" v-if="this.$store.state.status==true">
    <!-- 扫码 -->
    <div class="main" v-show="type == 1">
      <div class="el-icon-close" @click="loginClose()">
      </div>
      <!-- 二维码过期 -->
      <div class="content" v-if="this.$store.state.loginStatus == -1">
        <div class="title" @click="getTest()">
          <p> 扫码登录</p>
        </div>
        <div class="keyPic"  >
          <img :src="keyImg" :class="{bgBlack:this.$store.state.loginStatus == -1}" alt="">
          <div class="text">
            <p class="t1">二维码已失效</p>
            <p class="t2" @click="resetKeyImg()">点击刷新</p>
          </div>
          
        </div>
        <p>
          使用网易云音乐APP扫码登录
        </p>
      </div>
      <!-- 未登录状态 -->
      <div class="content" v-if="this.$store.state.loginStatus == 0">
        <div class="title">
          <p> 扫码登录</p>
        </div>
        <div class="keyPic">
          <img :src="keyImg" alt="">
        </div>
        <p>
          使用网易云音乐APP扫码登录
        </p>
        <p class="otherLogin" @click="otherLogin(2)">使用其他方式登录</p>
      </div>
      <!-- 授权中 -->
      <div class="content" v-if="this.$store.state.loginStatus == 1">
        <div class="title">
          <p> 扫码登录</p>
        </div>
        <div class="keyPic-1">
          <img src="~@/assets/img/手机.png" alt="">
          <p>扫描成功</p>
        </div>
        <p>
          请在手机上确认登录
        </p>
      </div>

      <div class="bottom" v-if="this.$store.state.loginStatus == 1">
        <p>选择其他登录模式<span class="el-icon-arrow-right"></span></p>
      </div>
    </div>
    <!-- 手机登录 -->
    <div class="main1" v-show="type == 2">
      <div class="el-icon-close" @click="loginClose()">
      </div>
      <div class="keyPic-1">
        <img src="~@/assets/img/手机.png" alt="">
      </div>
      <div class="input">
        <el-input v-model="input" prefix-icon="iconfont icon-shouji" placeholder="请输入内容"></el-input>
        <el-input placeholder="请输入密码" prefix-icon="iconfont icon-suo" v-model="input1" show-password></el-input>
        <div class="input-btn" @click="getLogin()"> 登录 </div>
      </div>
    </div>
  </div>
</template>
<script>
    import axios from 'axios'
    export default {
        props: {},
        data() {
            return {
              // 登录方式 1为扫码 2为手机登录
              type:1,
              input:'',
              input1:'',
              key:String,
              keyImg:String,
              code:801,
              status:0,
              codeFlag:true,
              cookie:String,
              id:Number,
              info:Object,
              keyFlag:true,
            }
        },
        created() {
          // addEventListener('click', this.click, false)
        },
        beforeDestroy() {
          // removeEventListener('click', this.click, false)
        },
        methods: {
          loginClose() {
            // 0关闭 1打开 2那么content内容改变 关闭
            this.$store.state.status = false;
          },
          getLogin() {
            axios.get('/login/cellphone?phone='+ this.input +'&password='+ this.input1 +'').then((res)=>{
              console.log('oth:',res);
              
              console.log(this.input);
            });
          },
          otherLogin(type) {
            this.type = type;
          },
          emitToParent() {
            this.$emit('child-event',this.info,1);
          },
          resetKeyImg() {
            this.keyFlag = false;
            let _this = this;
            let time = new Date().getTime();
            setInterval(function() {
            time = new Date().getTime();
            // console.log(time);
            },1000)
            axios.get('/login/qr/key?timestamp='+ time +'').then((res)=>{
              _this.key = res.data.data.unikey;
              axios.get('/login/qr/create?key='+ _this.key +'&qrimg='+ this.key +'&timestamp='+ time +'').then((res)=>{
              _this.keyImg = res.data.data.qrimg;
            });
            this.$store.state.loginStatus = 0;
            let timer = setInterval(function() {
           if(_this.code != 803&&_this.$store.state.status==true) {
             axios.get('/login/qr/check?key='+ _this.key +'&qrimg='+ this.key +'&timestamp='+ time +'').then((res)=>{
                // console.log('status:',res);
                _this.code = res.data.code;
                _this.cookie = res.data.cookie;
                // console.log(res.data.cookie);
                // _this.code = 800;
                // console.log(_this.code);
                // console.log(_this.status);
              })
           }
           if(_this.code == 803) {
             axios.get('/user/account?cookie='+ _this.cookie +'').then((res)=>{
                // console.log('用户:',res)
                // console.log(time);
                this.id = res.data.account.id;
              // this.keyImg = res.data.data.qrimg;
              });
           }
          if(_this.$store.state.loginStatus == 2) {
            clearInterval(timer);
            // console.log('定时器清除成功');
          }
          },1000)
          });
          }
        },
        watch: {
          code() {
            let _this = this;
            if(this.code == 803) {
              let time = new Date().getTime();
              this.$store.state.loginStatus = 2;
              // console.log('_this.status',this.$store.state.loginStatus);
              this.codeFlag = false;
              axios.get('http://localhost:3000/user/account?cookie='+ _this.cookie +'').then((res)=>{
                // console.log('账号:',res);
                _this.info = res.data.profile;
                _this.emitToParent();
                localStorage.setItem('cookie',_this.cookie);
              // this.keyImg = res.data.data.qrimg;
              });

              _this.loginClose();
            }
            if(this.code == 800&&this.codeFlag == true) {
              this.$store.state.loginStatus = -1;
              // console.log('_this.status',this.$store.state.loginStatus);
            }
            if(this.code == 802&&this.codeFlag == true) {
              this.$store.state.loginStatus = 1;
              // console.log('_this.status',this.$store.state.loginStatus);
            }
            
            // console.log('watch');
          }
        },
        mounted() {
          let _this = this;
          let time = new Date().getTime();
          let loginState = localStorage.getItem('isLogin');
          if(!loginState) {
            time = new Date().getTime();
          }
          axios.get('/login/qr/key').then((res)=>{
            _this.key = res.data.data.unikey;
            axios.get('https://autumnfish.cn/login/qr/create?key='+ _this.key +'&qrimg='+ this.key +'').then((res)=>{
              _this.keyImg = res.data.data.qrimg;
            });
          });
         let timer = setInterval(function() {
           if(_this.code != 803&&_this.$store.state.status == true) {
             axios.get('/login/qr/check?key='+ _this.key +'&qrimg='+ this.key +'&timestamp='+ time +'').then((res)=>{
                // console.log('status:',res);
                _this.code = res.data.code;
                _this.cookie = res.data.cookie;
                // console.log(res.data.cookie);
                // console.log(_this.code);
                // console.log(_this.status);
              })
           }
           if(_this.code == 803) {
            //  axios.get('https://autumnfish.cn/login/refresh?timestamp='+ time +'&cookie='+ _this.cookie +'').then((res)=>{
            //     // console.log('刷新:',res)
            //   });
             axios.get('/user/account?cookie='+ _this.cookie +'').then((res)=>{
                this.id = res.data.account.id;
              });
           }
              
          if(_this.$store.state.loginStatus == 2||_this.code == 800||!_this.keyFlag) {
            clearInterval(timer);
            // console.log('定时器清除成功');
          }
          },1000)
        }
    }
</script>

<style lang="scss" scoped>
@import '../assets/styles/index';
.loginTap {
  user-select: none;
  
  .main {
    width: 450px;
    height: 600px;
     box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    background: white;
    .el-icon-close {
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 20px;
        color: $b-third;
        cursor: pointer;
    }
    .content {
      width: 80%;
      margin: 0 auto;
      height: 300px;
      position: relative;
      top: 100px;
      .title {
        font-size: 35px;
      }
      .keyPic {
        text-align: center;
        margin-top: 30px;
        margin-bottom: 15px;
        img {
          width: 250px;
          background-color: black;
        }
        .bgBlack {
          // opacity: 0.1;
          background: black;
          // z-index: 999;
          filter:brightness(13%);
        }
        .text {
          position: relative;
          top: -150px;
          font-size: 20px;
          color: white;
          font-weight: 700;
          &>p {
            margin-bottom: 20px;
          }
          .t2 {
            background-color: rgb(46, 144, 224);
            padding: 5px 10px 5px 10px;
            width: 100px;
            position: relative;
            left: 120px;
            cursor: pointer;
            border-radius: 5px;
          }
        }
        
      }
      .otherLogin {
            position: relative;
            top: 70px;
            color: $b-second;
            cursor: pointer;
          }
      .keyPic-1 {
        text-align: center;
        margin-top: 30px;
        margin-bottom: 15px;
        img {
          width: 150px;
        }
        p {
          margin-top: 30px;
          color: $b-second;
          margin-bottom: 50px;
        }
      }
      p {
        text-align: center;
      }
    }
    .bottom {
      width: 80%;
      margin: 0 auto;
      height: 200px;
      position: relative;
      top: 100px;
      p {
        text-align: center;
        position: relative;
        top: 100px;
        cursor: pointer;
      }
    }
  }
  .main1 {
    width: 450px;
    height: 600px;
     box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    background: white;
    .el-icon-close {
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 20px;
        color: $b-third;
        cursor: pointer;
    }
    .keyPic-1 {
        text-align: center;
        // margin-top: 30px;
        margin-bottom: 15px;
        // position: relative;
        // top: 100px;
        padding-top: 100px;
        img {
          width: 120px;
        }
      }
    .input {
      width: 350px;
      margin: 0 auto;
      position: relative;
      top: 30px;
      .el-input {
        margin-bottom: 25px;
      }
    }
  }
}
</style>