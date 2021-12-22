<template>
  <div class="music">
    <div class="sing">
      <div class="left">
        <div class="content">
          <div class="needle" >
            <img src="../../assets/img/needle.png" :class="{needleRotate:rotate == true}"  ref="needle" mode="widthFix" alt="">
          </div>
          <div class="disc">
            <img src="../../assets/img/disc.png"  :class="{rotate360:rotate == true,pause:!rotate}" ref="disc" mode="widthFix" alt="">
          </div>
          <div class="avatarPic">
            <img :src="$store.state.picUrl" :class="{rotate360:rotate == true,pause:!rotate}" ref="avatar" alt="">
          </div>
        </div>
      </div>
      <div class="middle">
        <div class="text">
          <div class="songname">
            {{$store.state.singname}}
          </div>
          <div class="singer">
            {{$store.state.singer}}
          </div>
        </div>
        <div class="lyric" >
          <div class="lyric-content" >
            <!-- <span style="white-space: pre-wrap">{{lyc}}</span> -->
            <happy-scroll :scroll-top="top" :min-length-v="0.2" v-if="lyric">
            <div class="lyric-item" ref="lyric" :class="{currentItem:index == num}" @click="scrollChange()" v-for="(item,index) in lyric" :key="index">
              {{item.txt}}
            </div>
            </happy-scroll>
          </div>
        </div>
      </div>
      <div class="right">

      </div>
    </div>
    <div class="comment">
      <comment v-if="isrefresh"></comment>
      <!-- <comment></comment> -->
    </div>
  </div>
</template>
<script>
import comment from './musicComment.vue'
// import comment from '../comment.vue'
import axios from 'axios'
import Lyric from 'lyric-parser'
import { HappyScroll } from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'

export default {
  components: {
      'happy-scroll': HappyScroll,
    comment
  },
  props: {
  },
  data(){
    return{
      lyric:null,
      currentLyric:Object,
      top:-50,
      num:0,
      rotate:Boolean,
      timer:null,
      id:null,
      // 实时监视歌词
      time:0,
      isrefresh:true,
    }
  },
  created() {
    this.id = this.$store.state.musicID;
    document.documentElement.scrollTop = 0;
        // console.log(this.$store.state.picUrl);
        // console.log(this.$store.state.song);
        // console.log('音乐播放器',this.$store.state.audioMedia);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    scrollChange() {
      let len = this.$refs.lyric.length;
      let lyc = this.$refs.lyric;
      this.rotate = !this.$store.state.audioMedia.paused;
      let _this = this;
      let arr = [];
      for(let i = 0; i < len; i++) {
        arr.push(lyc[i].offsetTop);
        if(Math.floor(_this.$store.state.audioMedia.currentTime) >= Math.floor(this.lyric[i].time/1000)) {
          this.num = i;
        }
      }
      this.top = arr[this.num]-200;
    },
    getLyric() {
      axios.get('https://autumnfish.cn/lyric?id='+ this.$store.state.musicID +'').then((res)=>{
      
      this.currentLyric = new Lyric(res.data.lrc.lyric, this.lyricHandle)
      this.lyric = this.currentLyric.lines;
      this.lyc = this.currentLyric.lrc;
      console.log('歌词',this.currentLyric);
    });
    },
    afresh() {
      this.isrefresh = false;
      this.$nextTick(()=> {
        this.isrefresh = true;
      })
    },
  },
  mounted(){
    this.getLyric();
    this.timer = setInterval(() => {
        setTimeout(this.scrollChange, 0);
        this.time++;
      }, 1000);
  },
  watch:{
    time() {
      if(this.id != this.$store.state.musicID) {
        this.getLyric();
        this.afresh();
        this.id = this.$store.state.musicID;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/index';
  .music {
    width: 70%;
    margin: 0 auto;
    .sing {
      // background: forestgreen;
      display: flex;
      // width: 1200px;
      .left {
        // background: fuchsia;
        width: 40%;
        .content {
          // background: hotpink;
          width: 60%;
          margin: 0 auto;
          position: relative;
          .needle {
            img {
              width: 120px;
              position: relative;
              top: 90px;
              left: 160px;
              z-index: 999;
              transform-origin: 45px 0;
              transform: rotate(-40deg);
              transition: transform .5s;
              
            }
            .needleRotate {
              transform: rotate;
              // transform-origin: 45px 0;
              transform: rotate(0deg);
            }
          }
          %rotate {
            .rotate360 {
              animation: rotate360 30s linear 0s infinite;
              animation-fill-mode: forwards;
              // animation-play-state: paused;
            }
            @keyframes rotate360 {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          }
          .disc {
            .paused {
              animation-play-state:paused;
            }
            @extend %rotate;
            img {
              width: 350px;
              filter: brightness(2.45);
            }
              padding: 5px;
              background: $bd-first;
              border-radius: 50%;
              width: 350px;
              height: 350px;
          }
          .avatarPic {
            img {
              width: 230px;
              border-radius: 50%;
              position: absolute;
              top: 45%;
              left: 20%;
              z-index: 999;
              .paused {
              animation-play-state:paused;
            }
            }
            // .rotateGo {
            //   transform: rotate(1080deg);
	          //   transition: all 45s;
            // }
            
            @extend %rotate;
            // .rotate360 {
            //   animation: rotate360 30s linear 0s infinite;
            // }
            // @keyframes rotate360 {
            //   from {
            //     transform: rotate(0deg);
            //   }
            //   to {
            //     transform: rotate(360deg);
            //   }
            //   // 100% {
            //   //   transform: rotate(360deg);
            //   // }
            // }
          }
        }
        
      }
      .middle {
        margin-top: 50px;
        margin-left: 30px;
        width: 60%;
        // background: greenyellow;
        $width:700px;
        .text {
          // background: orangered;
          width: $width;
          &>div {
            // background: hotpink;
            height: 50px;
            text-align: center;
          }
          .songname {
            color: $b-first;
            font-size: 40px;
            text-align: center;
          }
          .singer {
            color: $b-third;
            line-height: 40px;
            text-align: center;
          }
        }
        .lyric {
          width: $width;
          // margin: 0 auto;
            // background: chartreuse;
            .lyric-content {
              // text-align: center;
              margin-top: 50px;
              height: 450px;
              .lyric-item {
                width: $width;
                text-align: center;
                font-size: 20px;
                font-weight: 400;
                margin-bottom: 30px;
                color:$b-second;
                position: relative;
                top: 0px;
                // word-wrap: break-word;
                &:first-child {
                  padding-top: 200px;
                }
                &:last-child {
                padding-bottom: 300px;
              }
             }
             .currentItem {
                font-size: 25px;
                font-weight: 700;
                color: black;
              }
            }
            
          }
      }
    }
    .comment {
      // background: red;
      width: 900px;
      padding-top: 40px;
      // margin: 0 auto;
      // background: red;
      position: relative;
      left: 100px;
      width: 70%;
    }
  }
</style>