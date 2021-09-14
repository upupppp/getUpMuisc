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
    <div class="other" v-for="(item,index) in album" :key="index">
      <div class="album" v-if="songs[index]">
        <div class="pic">
          <img :src="item.picUrl" alt="">
          <p>{{getDate(item.publishTime)}}</p>
          </div>
        <div class="word">
          <div class="h1">
            {{item.name}}
          </div>
          <!-- <div class="songs" v-for="(item,index) in songs[index]" :key="index" :class="{odd:index%2 == 0}">
            <div class="item1">{{index + 1 >= 10?index + 1:'0' + (index + 1)}}</div>
            <div class="item2">{{item.name}}</div>
            <div class="item3">{{getTime(item.dt)}}</div>
          </div>
          <div class="more" v-if="songs[index].length >10">
            查看全部{{songs[index].length}}首 >
          </div> -->


          <div class="songs" v-for="(item,index) in gotTop10[index]" @dblclick="playMusic(item.id,item.al.picUrl,item.name,item.ar[0].name)" :key="index" :class="{odd:index%2 == 0}">
            <div class="item1">{{index + 1 >= 10?index + 1:'0' + (index + 1)}}</div>
            <div class="item2">{{item.name}}</div>
            <div class="item3">{{getTime(item.dt)}}</div>
          </div>
          <div class="more" v-if="songs[index].length>10">
            查看全部{{songs[index].length}}首 >
          </div>
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
      songs:[],
    }
  },
  created() {
    this.id = this.$route.query.id;
  },
  computed: {
    getTop10() {
      return this.top50.slice(0,10);
    },
    gotTop10() {
      let other = []
      for(let i = 0; i < this.songs.length; i++) {
       other.push(this.songs[i].slice(0,10));
      }
      return other;
    }
  },
  methods: {
    getTime(time) {
      let second = Math.floor(time / 1000);
      let min = Math.floor(second / 60 % 60);
      let sec = Math.floor(second % 60);
      return (min >= 10?min:'0'+ min) + ':' + (sec >= 10?sec:'0' + sec);
    },
    getDate(d) {
      let time = new Date(d);
      let year = time.getFullYear();
      let month = time.getMonth()+1;
      let day = time.getDate();
      return year + '-' + month + '-' + day;
    },
    changeTop() {
      this.topFlag = !this.topFlag; 
    },
    getAlbum(id) {
        axios.get('https://autumnfish.cn/album?id='+id+'').then((res)=>{
          this.songs.push(res.data.songs);
          console.log('ada',this.songs);
      });
    },
    playMusic(id,pic,name,singerName) {
      let url = null;
      axios.get('https://autumnfish.cn/song/url?id='+id).then((res)=>{
            url = res.data.data[0].url;
            this.$store.state.url = url;
            this.$store.state.picUrl = pic;
            this.$store.state.singname = name;
            this.$store.state.singer = singerName;
            this.$store.state.musicPlay = true;
            this.$store.state.flag = true;
      });
    }
  },
  mounted(){
    axios.get('https://autumnfish.cn/artist/album?id='+ this.id +'&limit=50').then((res)=>{
          
          this.album = res.data.hotAlbums;
          this.artist = res.data.artist;
          console.log('album:',this.album);
          for (let index in this.album) {
            this.getAlbum(this.album[index].id);
            // console.log(index);
          }
    });
    axios.get('https://autumnfish.cn/artist/top/song?id='+ this.id +'').then((res)=>{
          
          this.top50 = res.data.songs;
          console.log('top50:',this.top50);
    });
    axios.get('https://autumnfish.cn/album?id=95509227').then((res)=>{
          console.log('album1:',res); 
    });
    }
}
</script>
<style lang="scss" scoped>
  @import '../../assets/styles/index';

  .Album {
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
      position: relative;
      top: -150px;
      .album {
        margin-bottom: 60px;
        position: relative;
        top: 10px;
        .pic{
          position: relative;
          left: -300px;
          p {
            margin-top: 10px;
            font-size: 18px;
            @extend %grey;
            font-weight: 400 !important;
          }
          img{
            width: 222px;
          }
        }
        .word {
          position: relative;
          top: -220px;
          left: -20px;
          .h1 {
            font-size: 30px;
            margin-left: 20px;
            font-weight: 700;
            position: relative;
            top: -30px;
            left: 30px;
            // padding-bottom: 100px;
          }
          .songs {
              width: 850px;
              display: inline-block;
              // font-size: 18px;
              font-weight:400;
              position: relative;
              left: 30px;
              text-align: left;
              height: 50px;
              line-height: 50px;
              .item1 {
                width: 15%;
                @extend %grey;
              }
              .item2 {
                cursor: default;
                width: 70%;
                text-align: left !important;
              }
              .item3 {
                width: 10%;
                @extend %grey;
              }
            }
          .more{
            height: 60px;
            width: 810px;
            @extend %grey;
            @extend .odd;
            line-height: 60px;
            font-weight: 100 !important;
            text-align: right;
            position: relative;
            left: 30px;
            font-size: 18px;
            cursor: pointer !important;
            }
        }
      }
    }
  }
</style>