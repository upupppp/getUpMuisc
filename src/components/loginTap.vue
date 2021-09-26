<template>
  <div class="loginTap" v-if="this.$store.state.status==true">
    <div class="main">
      <div class="el-icon-close" @click="loginClose()">
      </div>
      <!-- 未登录状态 -->
      <div class="content" v-if="this.$store.state.loginStatus == 0">
        <div class="title" @click="getTest()">
          <p> 扫码登录</p>
        </div>
        <div class="keyPic">
          <img :src="keyImg" alt="">
        </div>
        <p>
          使用网易云音乐APP扫码登录
        </p>
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
  </div>
</template>
<script>
    import axios from 'axios'
    export default {
        props: {},
        data() {
            return {
              input1:'',
              key:String,
              keyImg:String,
              code:801,
              status:0,
              codeFlag:true,
              cookie:String,
              id:Number,
              info:Object,
            }
        },
        created() {

        },
        methods: {
          loginClose() {
            // 0关闭 1打开 2那么content内容改变 关闭
            this.$store.state.status = false;
          },
          getTest() {
            this.$store.state.loginStatus = 1;
          },
          emitToParent() {
            this.$emit('child-event',this.info,1);
          }
        },
        watch: {
          code() {
            let _this = this;
            if(this.code == 803) {
              this.$store.state.loginStatus = 2;
              console.log('_this.status',this.$store.state.loginStatus);
              this.codeFlag = false;
              axios.get('https://autumnfish.cn/user/account?cookie='+ _this.cookie +'').then((res)=>{
                console.log('账号:',res);
                _this.info = res.data.profile;
                _this.emitToParent();
                localStorage.setItem('cookie',_this.cookie);
              // this.keyImg = res.data.data.qrimg;
              });

              axios.get('https://autumnfish.cn/user/subcount?cookie='+ _this.cookie +'').then((res)=>{
                console.log('用户:',res);
              // this.keyImg = res.data.data.qrimg;
              });
              _this.loginClose();
            }
            if(this.code == 800&&this.codeFlag == true) {
              this.$store.state.loginStatus = -1;
              console.log('_this.status',this.$store.state.loginStatus);
            }
            if(this.code == 802&&this.codeFlag == true) {
              this.$store.state.loginStatus = 1;
              console.log('_this.status',this.$store.state.loginStatus);
            }
            
            console.log('watch');
          }
        },
        mounted() {
          let _this = this;
          let time = new Date().getTime();
          setInterval(function() {
            time = new Date().getTime();
            // console.log(time);
          },1000)
          axios.get('https://autumnfish.cn/login/qr/key').then((res)=>{
            // this.personalized = res.data.result;
            this.key = res.data.data.unikey;
            axios.get('https://autumnfish.cn/login/qr/create?key='+ _this.key +'&qrimg='+ this.key +'').then((res)=>{
            // this.personalized = res.data.result;
              this.keyImg = res.data.data.qrimg;
            });
          });
          
         let timer = setInterval(function() {
           if(_this.code != 803&&_this.$store.state.status==true) {
             axios.get('https://autumnfish.cn/login/qr/check?key='+ _this.key +'&qrimg='+ this.key +'&timestamp='+ time +'').then((res)=>{
                console.log('status:',res);
                _this.code = res.data.code;
                _this.cookie = res.data.cookie;
                console.log(res.data.cookie);
                // _this.code = 800;
                console.log(_this.code);
                console.log(_this.status);
              })
           }
           if(_this.code == 803) {
             axios.get('https://autumnfish.cn/login/refresh?timestamp='+ time +'&cookie='+ _this.cookie +'').then((res)=>{
                console.log('刷新:',res)
              // this.keyImg = res.data.data.qrimg;
              });
             axios.get('https://autumnfish.cn/user/account?cookie='+ _this.cookie +'').then((res)=>{
                console.log('用户1:',res)
                console.log(time);
                this.id = res.data.account.id;
              // this.keyImg = res.data.data.qrimg;
              });
              axios.get('https://autumnfish.cn/user/subcount?cookie='+ _this.cookie +'').then((res)=>{
                console.log('账号1:',res)
              // this.keyImg = res.data.data.qrimg;
              });
              axios.get('https://autumnfish.cn/login/status?cookie='+ _this.cookie +'').then((res)=>{
                console.log('状态:',res)
              // this.keyImg = res.data.data.qrimg;
              });
              axios.get('https://autumnfish.cn/login/status?cookie='+ _this.cookie +'').then((res)=>{
                console.log('状态:',res)
              // this.keyImg = res.data.data.qrimg;
              });
           }
              
              if(_this.$store.state.loginStatus == 2||_this.code == 800) {
                clearInterval(timer);
                console.log('定时器清除成功');
              }
          },1000)
        // if(this.code == 802) {
        //         clearInterval(timer);
        //         console.log('定时器清除成功');
        // }
        
        
        }
    }
</script>

<style lang="scss" scoped>
@import '../assets/styles/index';
.loginTap {
  
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
    .top {
      width: 80%;
      margin: 0 auto;
      width: 400px;
      background-image:url('~@/assets/img/步步高升_树.png');
      height: 250px;
      position: relative;
      top: 40px;
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
        }
        
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
}
</style>