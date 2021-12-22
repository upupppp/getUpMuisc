<template>
  <div class="audioBox">
      <div class="audioPlayer" @click.stop :class="{animation:flag == true}" v-if="$store.state.flag==true">
          <div class="audio-left">
              <div class="audio-avatar">
                  <router-link :to="{path: '/musicDetail'}">
                  <img :src="$store.state.picUrl" alt="">
                  <div class="el-icon-arrow-up avater-text">
                  </div>
                  </router-link>
              </div>
              <div class="audio-text">
                  <p class="middle">{{$store.state.singname}}</p>
                  <p class="grey middle">{{$store.state.singer}}</p>
              </div>
          </div>
          <div class="audio-middle">
              <span class="iconfont icon-danlieliebiao playtype" 
                v-show="$store.state.playType == 1" 
                @click="onplayType(2)">
              </span>
              <span class="iconfont icon-suijisenlin playtype" 
                v-show="$store.state.playType == 2" 
                @click="onplayType(3)">
              </span>
              <span class="iconfont icon-danquxunhuan playtype" 
                v-show="$store.state.playType == 3" 
                @click="onplayType(1)">
              </span>
              <span class="iconfont icon-shangyishou" @click="lastSong()"></span>
              <span class="iconfont icon-play" v-if="!$store.state.musicPlay" @click="toplay"></span>
              <span class="iconfont icon-weibiaoti519" v-if="$store.state.musicPlay" @click="tostop"></span>
              <span class="iconfont icon-xiayishou" @click="nextSong()"></span>
              <div class="progress">
                  <span class="startTime">{{currentTime}}</span>
                  <el-slider 
                  tooltip-class="slider" 
                  :show-tooltip="false" 
                  v-model="value1" 
                  :step="1" 
                  :min="0" 
                  :max="duration" 
                  @change="formatTooltip"></el-slider>
                  <span class="dtime">{{endTime}}</span>
              </div>
          </div>
          <div class="audio-right">
              <div class="iconfont icon-24gl-volumeLow volume">
                  <div class="slider-wrapper">
                    <el-slider
                    v-model="value"
                    vertical
                    :show-tooltip="false"
                    @input="getVolume">
                    </el-slider>
                  </div>
              </div>
              <div class="iconfont icon-zu zu" @click.self="onPlayList()">
                  <div class="playList" v-if="$store.state.playListFlag == true">
                      <div class="top">
                          <div class="title">
                              当前播放
                          </div>
                          <div class="content">
                              <span>总{{$store.state.songList.length}}首</span>
                              <span @click="clearAll()">清空列表</span>
                          </div>
                      </div>
                    <happy-scroll hide-horizontal v-if="$store.state.songList">
                        <div class="table-tr"
                        @dblclick="playMusic(item.id,index,item)"
                        :class="{odd:index%2 == 0}"
                        v-for="(item,index) in $store.state.songList"
                        :key="index">
                          <div class="tags1" :class="{currentSong:$store.state.musicID == item.id}">{{item.name}}</div>
                          <div class="tags2" :class="{currentSong:$store.state.musicID == item.id}">{{item.ar[0].name}}</div>
                          <div class="tags3">{{getTime(item.dt)}}</div>
                        </div>
                    </happy-scroll>
                 </div>
              </div>
              
          </div>
      </div>
        <audio 
        id="audioMedia"
        ref="audioMedia"
        :src="$store.state.url"
        @pause="tostop"
        @play="toplay"
        :volume="value/100"
        autoplay 
        controls="" >
        </audio>
  </div>
</template>
<script>
import { HappyScroll } from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'
import axios from 'axios'
export default {
  components:{
      'happy-scroll': HappyScroll,
  },
  props: {
  },
  data(){
    return{
        audioMedia:null,
        value1: 0,
        currentTime:'00:00',
        endTime:null,
        duration:321,
        timer:null,
        //控制音乐播放器显示
        flag:false,
        value:100,
    }
  },
  created() {
    // console.log(1);
    // this.flag = this.$store.state.flag;
    this.endTime = this.$store.state.duration;
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.$store.state.duration = this.endTime;
  },
  methods: {
      onplayType(type) {
        this.$store.state.playType = type;
      },
      clearAll() {
          this.$store.state.songList = [];  
      },
      getTime(time) {
      let second = Math.floor(time / 1000);
      let min = Math.floor(second / 60 % 60);
      let sec = Math.floor(second % 60);
      return (min >= 10?min:'0'+ min) + ':' + (sec >= 10?sec:'0' + sec);
      },
      formatTooltip(val) {
        // @change事件 只在鼠标拖拽时触发 拖拽完触发
        this.audioMedia.currentTime = val;
        this.getCurrentTime();
      },
      getVolume(val) {
          this.audioMedia.volume = val/100;
      },
      onPlayList() {
          this.$store.state.playListFlag = !this.$store.state.playListFlag;
      },
      playMusic(id,index,item) {
        let url = null;
        this.$store.state.songIndex = index;
        axios.get('http://localhost:3000/song/url?id='+id+'').then((res)=>{
          url = res.data.data[0].url;
          this.$store.state.url = url;
          this.$store.commit('musicPlay',
          {
            item,
            url:url,
            index,
          })
        });
      },
      lastSong() {
          let url = null;
          // 音乐的详情信息
          let item = null;
          if(this.$store.state.playType == 1||this.$store.state.playType == 3) {
              if(this.$store.state.songIndex >= 1) {
              this.$store.state.songIndex -= 1;
              } else {
                  this.$store.state.songIndex = this.$store.state.songList.length-1;
              }
          }
          if(this.$store.state.playType == 2) {
              this.$store.state.songIndex = Math.round(Math.random() * (this.$store.state.songList.length - 1));
          }
          let index = this.$store.state.songIndex;
          item = this.$store.state.songList[index];
          axios.get('/song/url?id='+item.id+'').then((res)=>{
                url = res.data.data[0].url;
                this.$store.state.url = url;
          });
          this.$store.commit('musicPlay',{
            item,
            url:url,
            index
          })
      },
      nextSong() {
          let url = null;
          // 音乐的详情信息
          let item = null;
          // 按下一首前 如果顺序播放或者单曲循环
          if(this.$store.state.playType == 1||this.$store.state.playType == 3) {
              if(this.$store.state.songIndex < this.$store.state.songList.length-1) {
                this.$store.state.songIndex += 1;
              } else{
                    this.$store.state.songIndex = 0; 
                }
          }
          // 如果是随机播放
          if(this.$store.state.playType == 2) {
              this.$store.state.songIndex = Math.round(Math.random() * (this.$store.state.songList.length - 1));
          }
          let index = this.$store.state.songIndex;
          item = this.$store.state.songList[index];
          axios.get('/song/url?id='+item.id+'').then((res)=>{
                url = res.data.data[0].url;
                this.$store.state.url = url;
          });
          this.$store.commit('musicPlay',{
            item,
            url:url,
            index
          })
      },
      toplay() {
          let _this = this;
          // 设置定时器监听是否播放完毕
          let timer;
          timer = setInterval(() => {
              if(_this.audioMedia.ended) {
                  console.log('音乐已经播放完毕');
                  // 顺序播放
                  if(this.$store.state.playType == 1) {
                      this.nextSong();
                      // 随机播放
                  } if(this.$store.state.playType == 2) {
                      let index = Math.round(Math.random() * (this.$store.state.songList.length - 1));
                      this.$store.state.songIndex = index;
                      let id = this.$store.state.songList[index].id;
                      this.playMusic(id,index,this.$store.state.songList[index])
                      // 单曲循环
                  } else {
                      this.$store.state.audioMedia.play();
                  }
                  clearTimeout(timer);
              }
          },1000)
          this.flag = true;
          setTimeout(()=> {
              _this.flag = false;
          },3000)
          this.audioMedia.play();
        //   console.log('开始播放音乐');
          this.$store.state.musicPlay = true;
          this.$store.state.flag = true;
          this.getEndTime();
        //   setTimeout(this.getEndTime(),0)
      },
      tostop() {
          this.audioMedia.pause();
        //   console.log('开始暂停播放音乐');
          this.$store.state.musicPlay = false;
      },
      getEndTime() {
          // 获取结束的秒数
          let timeDisplay;
          this.duration = this.audioMedia.duration;
          timeDisplay = this.audioMedia.duration;
          let minute = timeDisplay / 60;
          let minutes = parseInt(minute);
          if (minutes < 10) {
              minutes = "0" + minutes;
          }
          //秒
          let second = timeDisplay % 60;
          let seconds = Math.round(second);
          if (seconds < 10) {
              seconds = "0" + seconds;
          }
          this.endTime = minutes+":"+seconds;
      },
      getCurrentTime() {
          // 只负责处理时间
          let timeDisplay;
            //用秒数来显示当前播放进度
            timeDisplay = Math.round(this.audioMedia.currentTime);//获取实时时间
            //分钟
            let minute = timeDisplay / 60;
            let minutes = parseInt(minute);
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            //秒
            let second = timeDisplay % 60;
            let seconds = Math.round(second);
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            this.currentTime = minutes+":"+seconds;
            // console.log('最原始：',this.audioMedia.currentTime);
            // console.log('原始',timeDisplay);
            // console.log('格式化:',minutes+":"+seconds);
      },
  },
  mounted(){
      this.audioMedia = this.$refs.audioMedia;
      this.$store.state.audioMedia = this.$refs.audioMedia;
      // 每秒处理现在的播放时间
      this.timer = setInterval(() => {
          if(!this.audioMedia.paused) {
            setTimeout(this.getCurrentTime(),0)
            setTimeout(()=> {
                this.value1 = this.audioMedia.currentTime;
            },)
          }
        }, 1000)
        console.log('flag',this.$store.state.flag); 
        this.value1 = this.$store.state.currentTime;
        this.audioMedia.currentTime = this.$store.state.currentTime;
        this.getCurrentTime();
        // this.getEndTime();
    }
}
</script>

<style lang="scss" >
@import '../assets/styles/index';
.audioBox{
    height: 50px;
    top: 50px;
}

audio{
    width: 100%;
    height: 50px;
    display: none;
}
.drawer-item {
    z-index: 666;
    margin-bottom: 111px;
    box-shadow: none;
}
.audioPlayer{
    width: 100%;
    height: 110px;
    background: white;
    position: fixed;
    // 测试 原本-100px
    bottom: -100px;
    z-index: 999;
    transition: all  .25s  ease-in;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    // @extend %animation;
    transform:translateY(0px);
}
.animation {
    transform:translateY(-100px);
}
.audioPlayer:hover{
    // bottom: 0px;
    @extend .animation;
}
.audioPlayer>div{
    display: inline-block;
}
.audio-avatar{
    width: 70px;
    height: 70px;
    margin: 20px;
    position: relative;
}
.audio-avatar:hover :first-child {
    filter: blur(1px) brightness(75%);
}
.audio-avatar:hover .avater-text{
    display: block;
    filter: blur(0px);
}
.avater-text {
    display: none;
    font-size: 35px;
    position: absolute;
    font-weight: 100;
    top: -40px;
    left: 25%;
    color: white;
    filter: brightness(100%);
    cursor: pointer;
}
.audio-avatar img{
    width: 100%;
    height: 100%;
    max-height: 100%;
    max-width: 100%;
    cursor: pointer;
    border-radius: 5px;
}

.audio-left>div{
    display: inline-block;
}
.audio-text{
    position: relative;
    top: 0px;
    cursor: pointer;
}
.audio-text>p{
    margin-bottom: 10px;
}
.middle{
    font-size: 20px;
    overflow: hidden;
    white-space: nowrap;
    width: 200px;
    /* text-overflow: ellipsis; */
}
.audio-middle{
    // background: red;
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translate(-50%);
    width: 700px;
    height: 110px;
    // background: red;
    .progress {
        width: 85%;
        margin: 0 auto;
        position: relative;
        top: -45px;
        .el-slider__runway {
            cursor: default;
}
        .el-slider__bar {
            height: 6px;
            background-color: #EC4141;
            cursor: default;
        }
        .el-slider__button {
            width: 0px;
            height: 0px;
            background-color: #EC4141;
            border: 1px solid #EC4141;
            cursor: default;
        }
        .el-slider__button-wrapper {
            width: 22px;
            // background-color: red;
            cursor: default;
        }
        .el-slider__button-wrapper:hover {
            cursor: default;
        }
        .el-slider:hover .el-slider__button {
            width: 12px;
            height: 12px;
        }
        .el-slider:hover .el-slider__bar{
            height: 7px;
        }
        .el-slider__button:hover {
            cursor: default;
        }
        
        .startTime {
            position: absolute;
            left: -45px;
            font-size: 14px;
            top: 3px;
            color: $b-third;
            top: 12px;
        }
        .dtime {
            position: absolute;
            right: -45px;
            font-size: 14px;
            top: 3px;
            color: $b-third;
            top: 10px;
        }
    }
}
.audio-middle>span{
    display: inline-block;
    font-size: 30px;
    position: relative;
    margin: 40px;
    top: -10px;
    left: 15%;
    cursor: pointer;
    &:hover {
        color: #EC4141;
    }
}
// 进度跳样式修改

.audio-right {
    width: 560px;
    // background: black;
    height: 110px;
    position: relative;
    left: 55%;
    .zu {
        font-size: 30px;
        cursor: pointer;
        position: relative;
        top: -20px;
        color: $b-first;
        left: 250px;
        .playList {
            position: absolute;
            top: -850px;
            left: -195px;
            width: 500px;
            height: 805px;
            background-color: white;
            z-index: 998;
            box-shadow:  0 0 3px rgba(0, 0, 0, 0.257);
            overflow: hidden;
            cursor: default;
            display: block;
            .top {
                margin-left: 20px;
                margin-top: 30px;
                height: 90px;
                // background-color: tomato;
                border-bottom: 1px solid $bd-second;
                .title {
                    font-size: 30px;
                    color: $b-first;
                    font-weight: 700;
                }
                .content {
                    margin-top: 20px;
                    display: flex;
                    justify-content: space-between;
                    &>span:first-child {
                        color: $b-third;
                        font-size: 18px;
                    }
                    &>span:last-child {
                        color: #6C92BC;
                        font-size: 20px;
                        margin-right: 20px;
                        cursor: pointer;
                        &:hover {
                            color: #2d6eb8 !important;
                        }
                    }
                }
            }
            .currentSong {
                color: #EC4444!important;
                font-weight: 400 !important;
            }
            .table-tr {
                display: flex;
                justify-content: flex-start;
                &:hover {
                    background:rgba(128, 128, 128, 0.123);
                }
                &:hover >div {
                    color: black;
                    opacity: 1;
                    // font-weight: 400;
                }
                &>div {
                    padding: 15px 0px;
                    font-size: 18px;
                    @extend %overflow;
                }
                .tags1 {
                    width: 240px;
                    padding-left: 20px;
                    color: $b-first;
                    font-weight: 400;
                    // opacity: .8;
                }
                .tags2 {
                    width: 150px;
                    color: $b-second;
                    font-weight: 100;
                }
                .tags3 {
                    width: 100px;
                    color: $b-third;
                    font-size: 16px;
                    font-weight: 400;
                    opacity: .6;
                    // background-color: violet;
                }
            }
        }
    }
    .volume {
        font-size: 30px;
        cursor: pointer;
        position: relative;
        top: 10px;
        color: $b-first;
        left: 200px;
        padding-top: 10px;
        &:hover .slider-wrapper {
            display: block;
        }
        .slider-wrapper {
        // background-color: rgba(233, 210, 210, 0.425);
        position: absolute;
        left: -10px;
        top: -120px;
        width: 40px;
        height: 130px;
        z-index: 999;
        display: none;
        cursor: default;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, 0.157);
        &:hover {
            display: block;
        }
        .el-slider__runway {
            margin-top: 20px;
            cursor: default;
            height: 100px;
}
        .el-slider__bar {
            height: 6px;
            background-color: red;
            cursor: default;
            &:hover {
                cursor: default;
            }
        }
        .el-slider__button {
            width: 12px;
            height: 12px;
            background-color: red;
            border: 1px solid red;
            cursor: default;
        }
        .el-slider__button-wrapper {
            cursor: default;
        }
        .el-slider__button-wrapper:hover {
            cursor: default;
        }
        .el-slider__button:hover {
            cursor: default;
        }
    }
    }
    
}
/* .audioShow{
    display: none;
} */
</style>