<template>
  <div class="mvSon" ref="mvSon">
    <div class="main">
      <h1 class="title">
        <span class="el-icon-arrow-left"></span> <span>MV详情</span>
      </h1>
      <div class="mv" >
        <video :src="url" ref="mvMedia" 
        controls 
        autoplay 
        disablePictureInPicture 
        @click="toPlay()" 
        v-if="url"></video>
        <span class="el-icon-video-play" @click="toplay()" v-show="!mediaFlag"></span>
      </div>
      <div class="content">
        <div class="avatar">
          <el-avatar :size="80" v-if="mv.artists" mode="widthFix" :src="mv.artists[0].img1v1Url"></el-avatar>
          <span class="name" v-for="(item,index) in name" :key="index">
            {{item}}
          </span>
        </div>
        <div class="shop" ref="shop">
          <div class="title">
            <h1>{{mv.name}}</h1>
            <div class="text">
              <p class="time">发布:{{mv.publishTime}}</p>
              <p class="count">播放:{{mv.playCount > 100000?Math.floor(mv.playCount/10000)+'万':mv.playCount}}次</p>
            </div>
          </div>
          <div class="status" v-if="info">
            <!-- 是否被点赞再info 是否被收藏item里面 -->
            <div @click="sendTip(1)" :style="info.liked == true?'color:red':'color:#303133'">{{info.liked == true?'已赞'+info.likedCount:'赞'+(info.likedCount)}}</div>
            <div @click="sendTip(2)" :style="subed == true?'color:red':'color:#303133'">{{subed == true?'已收藏'+mv.subCount:'收藏'+(mv.subCount)}}</div>
            <div>分享({{info.shareCount}})</div>
            <div>下载MV</div>
          </div>
        </div>
        <div class="infoComment">
      <div class="text">
        评论<span>({{comment.total}})</span>
      </div>
      <textarea name="" id="" v-model="text" @keydown.enter="sendComment()">
      </textarea>
      <span class="textCount">{{140-textSum}}</span>
      <div class="comment-btn" @click="sendComment()">
        评论
      </div>
    </div>
        <div class="comment">
          <comment v-if="isrefresh"></comment>
        </div>
      </div>
    </div>
    <div class="aside">
      <div class="title">
        <span>相关推荐</span>
      </div>
      <div class="content" @click="goUrl(item.id)" v-for="(item,index) in mvs" :key="index">
        <div class="img">
          <img :src="item.cover" alt="">
          <p class="count">
            <span class="el-icon-video-play">
            </span>
            {{item.playCount > 100000?Math.floor(item.playCount/10000)+'万':item.playCount}}
          </p>
          <p class="duration">{{getTime(item.duration)}}</p>
        </div>
        <div class="text">
          <p>{{item.name}}</p>
          <p>{{item.artistName}}</p>
        </div>
      </div>
    </div>
    <transition name="el-fade-in">
    <div class="tipMsg" v-show="show">
      {{tip}}
    </div>
    </transition>
  </div>
</template>
<script>
import axios from 'axios'
import comment from './comment.vue'
export default {
  components:{
    comment
  },
  props: {
  },
  data(){
    return{
      url:String,
      item:Object,
      // avatar:String,
      mv:Object,
      name:[],
      mvs:null,
      info:Object,
      id:null,
      offsetChange:0,
      loading:true,
      mediaFlag:true,
      tip:"",
      text:"",
      show:false,
      subed:false,
      comment:Object,
      textSum:0,
      isrefresh: true,
    }
  },
  computed: {
    getHotComment() {
      if(this.comment.hotComments) {
        return this.comment.hotComments.slice(0,10);
      }
      
    }
  },
  created() {
    // this.avatar = this.$route.query.avatar;
    this.item = this.$route.query.item;
    this.id = this.$route.query.id;
    this.$store.state.flag = false;
    // console.log('item',this.item);
    // console.log('id:',this.id);
    this.$store.state.audioMedia.pause();
    window.addEventListener('scroll',this.pipStatus);
    addEventListener('click', this.click, false)
    document.documentElement.scrollTop = 0;
  },
  beforeDestroy() {
    removeEventListener('click', this.click, false)
    this.$store.state.flag = true;
  },
  methods: {
    sendTip(type) {
      if(type == 1) {
        if(this.info.liked == true) {
          this.tip = "已取消赞";
        }
        else {
          this.tip = "点赞";
        }
        this.sendLiked();
        let timer = setInterval(()=> {
          this.getInfo();
        },500)
        this.show = true;
        setTimeout(() => {
          this.show = false;
          clearInterval(timer);
        }, 1000);
      }
      if(type == 5) {
        this.tip = "评论成功!";
        this.show = true;
        
        setTimeout(() => {
          this.show = false;
        }, 1000);
      }
      else if(type == 2){
        if(this.subed == true) {
          console.log(this.subed);
          this.tip = "视频取消收藏成功!";
          this.getSub(0);
        }
        else {
          console.log(this.subed);
          this.tip = "收藏成功!";
          this.getSub(1);
        }
        let timer = setInterval(()=> {
          this.getMV();
        },500)
        this.show = true;
        setTimeout(() => {
          this.show = false;
          clearInterval(timer);
        }, 1000);
      }
    },
    getMV() {
      let timer = new Date().getTime();
      let cookie = localStorage.getItem('cookie');
      axios.get('http://localhost:3000/mv/detail?mvid='+ this.id +'&timestamp='+ timer +'&cookie='+ cookie +'').then((res)=>{
        console.log('mvDetail:',res);
        this.mv = res.data.data;
        this.subed = res.data.subed;
    });
    },
    goUrl(id) {
      this.$router.push({path:'/mvSon', query: {id:id}})
    },
    getSub(t) {
      let timer = new Date().getTime();
      let cookie = localStorage.getItem('cookie');
      if(cookie) {
        axios.get('/mv/sub?t='+ t +'&mvid='+ this.id +'&timestamp='+ timer +'&cookie='+ cookie +'').then((res)=>{
          // console.log('sendSub:',res);
        });
      }
      else {
        this.loginTip();
      }
    },
    loginTip() {
        this.tip = '请登录!',
        this.show = true;
        setTimeout(()=>{
          this.show = false
        },1000);
    },
    sendLiked() {
      let cookie = localStorage.getItem('cookie');
      if(cookie) {
        let t = this.info.liked == false?1:0;
        let time = new Date().getTime();
        axios.get('/resource/like?id='+ this.id +'&t='+ t +'&type=1&timestamp='+ time +'&cookie='+ cookie +'').then((res)=>{
          // console.log('liked:',res);
        });
      }
      else {
        this.loginTip();
      }
    },
    getInfo() {
      let timer = new Date().getTime();
      let cookie = localStorage.getItem('cookie');
      axios.get('/mv/detail/info?mvid='+ this.id +'&timestamp='+ timer +'&cookie='+ cookie +'').then((res)=>{
          this.info = res.data;
          // console.log('mvInfo:',res);
      });
    },
    getName() {
        for(let i = 0; i < this.mv.artists.length; i++) {
        if(i > 0) {
          this.mv.artists[i].name =' / '+ this.mv.artists[i].name;
          this.name.push(this.mv.artists[i].name);
        }
      }
      this.name.unshift(this.mv.artists[0].name);
    },
    getTime(time) {
      let second = Math.floor(time / 1000);
      let min = Math.floor(second / 60 % 60);
      let sec = Math.floor(second % 60);
      return (min >= 10?min:'0'+ min) + ':' + (sec >= 10?sec:'0' + sec);
    },
    toplay() {
      // 负责暂停时控制图标从出现
          let mvMedia = this.$refs.mvMedia;
          this.mediaFlag = mvMedia.paused;
          if(mvMedia.paused) {
            mvMedia.play();
          }
          // console.log(mvMedia.VideoTrackList)
    },
    toPlay() {
          let mvMedia = this.$refs.mvMedia;
          
          this.mediaFlag = mvMedia.paused;
          // mvMedia.onPause = ()=>console.log(11);
          // console.log(mvMedia.VideoTrackList)
    },
    pipStatus() {
      // 747 是功能区class 的offsetTop,但是因为方法调用顺序的为问题,改用固定的高度
      // let shopOffset = this.$refs.shop.offsetTop;

      // console.log(document.documentElement.scrollTop);
      // console.log(this.$refs.shop.clientHeightTop);
      // let mvMedia = this.$refs.mvMedia;
      // console.log(this.offsetChange);
      if(document.documentElement.scrollTop >= 747) {
        this.offsetChange = 1;
      }
      else {
        this.offsetChange = 0;
      }
    },
    refresh() {
      this.isrefresh = false;
      this.$nextTick(()=> {
      this.isrefresh = true;
      })
    },
    sendComment() {
      let time = new Date().getTime();
      let cookie = localStorage.getItem("cookie");
      // console.log(cookie);
      if(cookie) {
        axios.get('/comment?t=1&type=1&id='+ this.id +'&content='+ this.text +'&timestamp='+ time +'&cookie='+ cookie +'').then((res)=>{
          // console.log('sendComment:',res);
          this.sendTip(5);
        }).catch((err)=> {
        console.log('错误:',err);
        });
        this.text = "";
      }
      else {
        this.loginTip();
      }
      setTimeout(() => {
        this.refresh();
      }, 500);
    }
  },
  // 监听函数watch:里面方法的名字必须所监听的属性,当被监听的属性的值发生变化时,触发方法
  watch:{
    offsetChange() {
      let video = this.$refs.mvMedia;
        if(this.offsetChange == 1) {
          video.disablePictureInPicture = false;
          setTimeout(()=>video.requestPictureInPicture(),200);
          console.log('开启画中画')
          // console.log(video.requestPictureInPicture());
        }
      if(this.offsetChange == 0) {
          video.disablePictureInPicture = true;
          setTimeout(()=>document.exitPictureInPicture(),200);
          console.log('关闭画中画');
      }
    },
    text() {
      this.textSum = this.text.length;
    },
  },
  mounted(){
    // setInterval(()=>document.addEventListener(''))
    axios.get('http://localhost:3000/mv/url?id='+ this.id +'').then((res)=>{
          console.log('url:',res);
          this.url = res.data.data.url;
    });
    axios.get('http://localhost:3000/simi/mv?mvid='+ this.id +'').then((res)=>{
          this.mvs = res.data.mvs;
          console.log('mvDetail1:',this.mvs);
    });
    this.getMV();
    this.getInfo();
    axios.get('http://localhost:3000/user/detail?uid=32953014').then((res)=>{
          console.log('comment1:',res);
          // this.comment = res.data;
          // this.url = res.data.data.url;
          let mvMedia = this.$refs.mvMedia;
          this.mediaFlag = mvMedia.paused;
          this.video = this.$refs.mvMedia;
          setTimeout(()=> {
            this.getName();
          },300)
          
          
    });
    axios.get('http://localhost:3000/comment/mv?id='+ this.id +'').then((res)=>{
          console.log('comment:',res);
          this.comment = res.data;
          setTimeout(()=>this.loading = false,2000);
          // this.url = res.data.data.url;
      });
    },
  watch:{
    '$route': function (to, from) {
        this.$router.go(0)
      }
  },
  destroyed() {
    if(this.offsetChange == 1) {
        document.exitPictureInPicture();
        // mvMedia.pause();
        this.video.pause();
      }
  }
}
</script>

<style lang="scss" scoped>
  @import '../assets/styles/index';
  .mvSon {
    @extend %main;
    position: relative;
    display: flex;
    justify-content: space-around;
    .main {
      width: 70%;
      // height: 5000px;
      // background: blueviolet;
      .title{
        font-size: 25px;
        .el-icon-arrow-left{
          font-weight: 700;
          color: #303133;
        }
      }
      .mv {
        video {
          width: 900px;
          height: 600px;
          cursor: pointer;
        }
        .el-icon-video-play {
          font-size: 100px;
          color: #ffffffe7;
          position: absolute;
          cursor: pointer;
          top: 300px;
          left: 30%;
          border-radius: 50%;
          &:hover {
            color: white;
          }
        }
      }
      .content {
        .avatar {
          * {
            vertical-align: middle;
            margin-right: 10px;
            cursor: pointer;
          }
          el-avatar {
            width: 50px;
          }
          .name {
            color: #606266;
            font-size: 18px;
            &:hover {
              color: #303133;
            }
          }
        }
        .shop {
          margin-bottom: 80px;
          .title {
            margin-top: 40px;
            margin-bottom: 45px;
            h1 {
              color: #303133;
              font-size: 30px;
              font-weight:700;
            }
            .text {
              display: flex;
              margin-top: 30px;
              font-size: 18px;
              color: #909399;
              width: 400px;
              p {
                flex: 1;
              }
            }
          }
          .status {
            display: flex;
            div {
              justify-content: flex-start;
              width: 150px;
              border-radius: 30px;
              height: 40px;
              text-align: center;
              line-height: 40px;
              border:1px solid rgb(224, 222, 222);
              margin: 0px 5px 0px 5px;
              color: #303133;
              cursor: pointer;
              &:hover {
                background: rgba(128, 128, 128, 0.089);
              }
            }
          }
        }
        .infoComment {
    margin-bottom: 50px;
    // background: chartreuse;
    .text {
      margin-bottom: 20px;
      font-size: 35px;
      font-weight: 700;
      color:$b-first;
      span {
        font-size: 16px;
        color: $b-third;
      }
    }
    textarea {
              width: 880px;
              height: 100px;
              border-radius: 5px;
              border: 1px solid $bd-first;
              font-size: 20px;
              color: $b-first;
              font-weight:500;
              
    }
    .textCount {
              color: $b-fourth;
              position: relative;
              top:-10px;
              left: -40px;
    }
    .comment-btn {
              color: $b-first;
              width: 70px;
              height: 35px;
              border-radius: 30px;
              border: 1px solid $bd-first;
              text-align: center;
              line-height: 35px;
              margin-top: 10px;
              position: relative;
              left: 815px;
              cursor: pointer;
              &:hover {
                background: rgba(128, 128, 128, 0.089);
              }
    }
  }
        .comment {
          
        }
      }
      .tip {
        position: relative;
        left: 50%;
        margin: 35px 0 80px 0px;
        font-size: 18px;
        border: 1px solid $b-second;
        // background: black;
        width: 140px;
        padding: 10px 0 10px 0;
        border-radius: 30px;
        text-align: center;
        cursor: pointer;
        color: $b-first;
        &:hover {
          color: #000000;
        }
      }
    }
    .aside {
      width: 30%;
      height: 900px;
      // background: gray;
      .title {
       font-size: 25px;
       margin-bottom: 43px;
      }
      .content {
        display: flex;
        .img {
          // * {
          //   cursor: pointer;
          // }
          cursor: pointer;
          img {
            width: 200px;
            border-radius: 5px;
          }
          span,p {
            color: #fffffff6;
            font-weight: 400;
            font-size: 16px;
          }
          .count {
            position: relative;
            top: -105px;
            left: 130px;
          }
          .duration {
            position: relative;
            top: -45px;
            left: 150px;
          }
        }
        .text {
          margin-top: 10px;
          margin-left: 10px;
          p {
            margin-bottom: 40px;
          }
        }
      }
    }
    .tipMsg {
      color: white;
      background: #303133;
      padding: 25px 30px;
      border-radius: 30px;
      position: fixed;
      left: 40%;
      top: 30%;
      z-index: 999;
      font-size: 22px;
    }
  }
</style>