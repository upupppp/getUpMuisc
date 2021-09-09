<template>
  <div class="Album">
    <div class="top50">
      <img src="../../assets/img/top50.png" alt="">
      <div class="album">
        <h1>热门50首</h1>
        <div v-for="(item,index) in top50" :key="item.index" v-show="topFlag" :class="{odd:index%2 == 0}">
          <div class="item1">
            {{index + 1 >= 10?index + 1:'0' + (index + 1)}}
          </div>
          <div class="item2">
            {{item.name}}
            <div class="t2">{{item.alia.length>0?'('+item.alia[0]+')':''}}</div>
          </div>
          <div class="item3">
            {{getTime(item.dt)}}
          </div>
          <div class="item4">

          </div>
        </div>
        <div v-for="(item,index) in getTop10" :key="index" v-show="!topFlag" :class="{odd:index%2 == 0}">
          <div class="item1">
            {{10 > (index + 1)? '0' + (index+1):index+1}}
          </div>
          <div class="item2">
            {{item.name}}
            <div class="t2">{{item.alia.length>0?'('+item.alia[0]+')':''}}</div>
          </div>
          <div class="item3">
            {{getTime(item.dt)}}
          </div>
          <div class="item4">
            
          </div>
        </div>
        <div class="more" @click="changeTop()" v-if="!topFlag">
          查看全部{{top50.length}}首 >
        </div>
      </div>
    </div>
    <div class="other">
      
      <div class="album" v-for="(item,index) in album" :key="index">
        <h1>{{item.name}}</h1>
        <div v-for="(item,index) in album" :key="item.index" v-show="topFlag" :class="{odd:index%2 == 0}">
          <img :src="item.blurPicUrl" alt="">
          <div class="item1">
            {{index + 1 >= 10?index + 1:'0' + (index + 1)}}
          </div>
          <div class="item2">
            {{item.name}}
            <div class="t2">{{item.alia.length>0?'('+item.alia[0]+')':''}}</div>
          </div>
          <div class="item3">
            {{getTime(item.dt)}}
          </div>
          <div class="item4">

          </div>
        </div>
        <div v-for="(item,index) in getTop10" :key="index" v-show="!topFlag" :class="{odd:index%2 == 0}">
          <div class="item1">
            {{10 > (index + 1)? '0' + (index+1):index+1}}
          </div>
          <div class="item2">
            {{item.name}}
            <div class="t2">{{item.alia.length>0?'('+item.alia[0]+')':''}}</div>
          </div>
          <div class="item3">
            {{getTime(item.dt)}}
          </div>
          <div class="item4">
          </div>
        </div>
        <div class="more" @click="changeTop()" v-if="!topFlag">
          查看全部{{top50.length}}首 >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  props: {
  },
  data(){
    return{
      top50:[],
      album:[],
      artist:[],
      topFlag:false,
    }
  },
  created() {
    this.id = this.$route.query.id;
  },
  computed: {
    getTop10() {
      return this.top50.slice(0,10);
    }
  },
  methods: {
    getTime(time) {
      let second = Math.floor(time / 1000);
      let min = Math.floor(second / 60 % 60);
      let sec = Math.floor(second % 60);
      return (min >= 10?min:'0'+ min) + ':' + (sec >= 10?sec:'0' + sec);
    },
    changeTop() {
      this.topFlag = !this.topFlag; 
    }
  },
  mounted(){
    axios.get('https://autumnfish.cn/artist/album?id='+ this.id +'&limit=50').then((res)=>{
          console.log('album:',res);
          this.album = res.data.hotAlbums;
          this.artist = res.data.artist
    });
    axios.get('https://autumnfish.cn/artist/top/song?id='+ this.id +'').then((res)=>{
          
          this.top50 = res.data.songs;
          console.log('top50:',this.top50);
          
          console.log('top10:',this.top10);
    });
    }
}
</script>
<style lang="scss" scoped>
  @import '../../assets/styles/index';

  .Album {
    height: 2000px;
    @extend %singerDetailC;
    .top50 {
      position: relative;
      left: 350px;
      top: 10px;
      .album{
        position: relative;
        top: -220px;
        width: 850px;
        left: 300px;
      h1 {
        font-size: 30px;
        margin-left: 20px;
        font-weight: 700;
        margin-bottom: 30px;
      }
      div>div{
        display: inline-block;
        text-align: center;
        height: 30px;
      }
      div {
        // &:hover {
        //   @extend %grey1;
        // }
        .item1 {
          width: 15%;
          @extend %grey;
        }
        .item2 {
          cursor: default;
          width: 70%;
          text-align: left !important;
          display: inline-block;
          // @extend %overflow;
          .t2 {
            @extend %grey;
          }
        }
        .item3 {
          width: 10%;
          @extend %grey;
        }
      }
      .more{
        height: 60px;
        @extend %grey;
        @extend .odd;
        line-height: 60px;
        font-weight: 100 !important;
        text-align: right;
        padding-right: 40px;
        font-size: 18px;
        cursor: pointer !important;
      }
      }
    }
    .other {
      @extend .top50;
      height: 1000px;
      position: relative;
      top: -140px;
    }
  }
</style>