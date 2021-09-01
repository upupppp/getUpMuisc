<template>
  <div class="audioBox">
      <div class="audioPlayer" v-if="$store.state.flag==true">
          <div class="audio-left">
              <div class="audio-avatar">
                  <img :src="$store.state.picUrl" alt="">
              </div>
              <div class="audio-text">
                  <p class="middle">{{$store.state.singname}}</p>
                  <p class="grey middle">{{$store.state.singer}}</p>
              </div>
          </div>
          <div class="audio-middle">
              <span class="iconfont icon-shangyishou"></span>
              <span class="iconfont icon-play" v-if="!$store.state.musicPlay" @click="toplay"></span>
              <span class="iconfont icon-weibiaoti519" v-if="$store.state.musicPlay" @click="tostop"></span>
              <span class="iconfont icon-xiayishou"></span>
          </div>
          <div class="audio-right">

          </div>
      </div>
        <audio id="audioMedia" ref="audioMedia" :src="$store.state.url"  autoplay controls="" >
        </audio>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  props: {
  },
  data(){
    return{
    }
  },
  created() {

        console.log(this.$store.state.songId);
        
  },
  methods: {
      toplay() {
          let audioMedia = this.$refs.audioMedia;
          audioMedia.play();
          this.$store.state.musicPlay = !this.$store.state.musicPlay
      },
      tostop() {
          let audioMedia = this.$refs.audioMedia;
          audioMedia.pause();
          this.$store.state.musicPlay = !this.$store.state.musicPlay
      }
  },
  mounted(){
    }
}
</script>

<style>
.audioBox{
    height: 50px;
    top: 50px;
}
audio{
    width: 100%;
    height: 50px;
    display: none;
}
.audioPlayer{
    width: 100%;
    height: 110px;
    background: white;
    position: fixed;
    bottom: 0px;
    z-index: 999;
    border-top: 1px solid rgba(0, 0, 0, 0.055);
}
.audioPlayer>div{
    display: inline-block;
}
.audio-avatar{
    width: 70px;
    height: 70px;
    padding: 20px;
}
.audio-avatar img{
    width: 100%;
    height: 100%;
    max-height: 100%;
    max-width: 100%;
    border-radius: 5px;
}
.audio-left>div{
    display: inline-block;
}
.audio-text{
    position: relative;
    top: -15px;
}
.audio-text>p{
    margin-bottom: 10px;
}
.middle{
    font-size: 20px;
}
.audio-middle{
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translate(-50%);
    width: 700px;
    height: 110px;
}
.audio-middle>span{
    display: inline-block;
    font-size: 30px;
    position: relative;
    margin: 40px;
    top: -10px;
    left: 25%;
    cursor: pointer;
}
/* .audioShow{
    display: none;
} */
</style>