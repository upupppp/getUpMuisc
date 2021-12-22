<template>
  <div class="Album">
    <div class="top50" >
      <img src="../../assets/img/top50.png" alt="">
      <div class="album">
        <h1>热门50首</h1>
        <div v-for="(item,index) in top50" :key="item.index" @dblclick="playMusic(item.id,index,item)" v-show="topFlag" :class="{odd:index%2 == 0}">
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
        <div v-for="(item,index) in getTop10" @dblclick="playMusic(item.id,index,item)" :key="index" v-show="!topFlag" :class="{odd:index%2 == 0}">
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
          <img v-lazy="item.picUrl" alt="">
          <p>{{getDate(item.publishTime)}}</p>
          </div>
        <div class="word">
          <div class="h1">
            {{item.name}}
          </div>
          <div class="songs" v-for="(item,index) in gotTop10[index]" @dblclick="playMusic(item.id,index,item)" :key="index" :class="{odd:index%2 == 0}">
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
      limit:5,
      page:1,
      onPullDown:true,
      loading:true,
    }
  },
  created() {
    this.id = this.$route.query.id;
    addEventListener('click', this.click, false)
  },
  beforeDestroy() {
    removeEventListener('click', this.click, false)
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
    handleScroll() {
      // scrollTop 滚动条滚动时,距离顶部的距离
      let scrollTop = document.documentElement.scrollTop  || document.body.scrollTop;
      // 可视区高度
      let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      // 滚动条总高度
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      // 滚动条到底部的条件
      if (scrollTop + windowHeight == scrollHeight && this.onPullDown == true) {
        let page = this.page + 1;
        this.debounce(page, 1);
      }
    },
    debounce(args, delay) {
      // 防抖但是这里没必要用而且我这个写不出来防抖效果,这里的实际效果是节流
      let timer;
      let _this = this;
      let page = args;
        clearTimeout(timer);
         timer = setTimeout(function() {
          _this.page = page;
          _this.ms();
          // console.log('args:',page)
        }, delay)    
    },
    ms() {
      axios.get('/artist/album?id='+ this.id+'&limit='+ this.limit * this.page +'').then((res)=>{
          this.album = res.data.hotAlbums;
          // this.artist = res.data.artist;
          // console.log('album:',this.album);
          for (let index in this.album) {
            this.getAlbum(this.album[index].id);
            // console.log(index);
          }
          console.log(1);
    });
    },
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
        axios.get('/album?id='+id+'').then((res)=>{
          this.songs.push(res.data.songs);
          // console.log('ada',this.songs);
      });
    },
    playMusic(id,index,item) {
      console.log(item);
      let url = null;
      axios.get('/song/url?id='+id+'&cookie='+this.$store.state.cookie+'').then((res)=>{
        url = res.data.data[0].url;
        this.$store.state.url = url;
        this.$store.state.songIndex = index;
        if(this.$store.state.songList !== this.top50) {
          this.$store.state.songList = this.top50;
        }
        this.$store.commit('musicPlay',
        {
          item,
          url:url,
          index,
          type:1
        })
      });
    },
  },
  mounted(){
    axios.get('/artist/album?id='+ this.id +'&limit='+ this.limit+'').then((res)=>{
          this.album = res.data.hotAlbums;
          // this.artist = res.data.artist;
          console.log('album:',this.album);
          for (let index in this.album) {
            this.getAlbum(this.album[index].id);
            // console.log(index);
          }
          // setInterval(()=>{
          //   this.loading = false;
          // },700)
          window.addEventListener('scroll',this.handleScroll);
          // window.addEventListener('scroll',this.handleScroll);
    });
    axios.get('/artist/top/song?id='+ this.id +'').then((res)=>{
          
          this.top50 = res.data.songs;
          // console.log('top50:',this.top50);
    });
    }
}
</script>
<style lang="scss" scoped>
  @import '../../assets/styles/index';

  .Album {
    cursor: default;
    user-select: none;
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
            user-select: none;
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