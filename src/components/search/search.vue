<template>
  <div class="search">
    <div class="searchTip">
      找到{{total}}{{type}}
    </div>
    <div class="main">
      <div class="top">
        <div
          class="top-item" 
          :class="{currentTap:item.type == currentTap}" 
          v-for="item in Type" 
          :key="item.type"
          @click="getCurrent(item.type)">
          {{item.value}}
        </div>
      </div>
      <div class="loading" 
        v-if="loading" 
        v-loading="loading" 
        element-loading-text="载入中"
        element-loading-spinner="el-icon-loading">
      </div>
      <div class="content">
        <div class="bestMatch" v-if="currentTap == 1&&bestMatch.artist&&!loading">
        <div class="title">
          最佳匹配
        </div>
        <div class="bestMatch-item" @click="goURL(1)">
          <img v-lazy="bestMatch.artist[0].img1v1Url" mode="widthFix" alt="">
          <span>歌手:{{bestMatch.artist[0].name}}</span>
          <span class="alias" v-if="bestMatch.artist[0].alias">({{bestMatch.artist[0].alias[0]}})</span>
          <span class="el-icon-arrow-right arrow"></span>
        </div>
        </div>
        <div class="songList" v-if="currentTap == 1">
        <div class="singList-table" v-if="search.songs">
        <div class="table-th">
            <div class="tags1">音乐标题</div>
            <div class="tags2">歌手</div>
            <div class="tags3">专辑</div>
            <div class="tags4">时长</div>
          </div>
          <div class="table-tr" :class="{odd:index%2 == 0}" @dblclick="playMusic(item.id,item.album.picId,item.name,item.artists[0].name)" v-for="(item,index) in search.songs" :key="index">
            <div class="tags0">{{index+1>=10?index + 1:'0' + (index + 1)}}</div>
            <div class="tags1">{{item.name}}</div>
            <div class="tags2" @click="goURL(2,item)">{{item.artists[0].name}}</div>
            <div class="tags3" >{{item.album.name}}</div>
            <div class="tags4">{{getTime(item.duration)}}</div>
          </div>
      </div>
        </div>
        <div class="artists" v-if="currentTap == 100">
        <div class="artist-item" @click="goURL(2,item)" :class="{odd:index%2 == 0}" v-for="(item,index) in search.artists" :key="item.id">
          <img v-lazy="item.img1v1Url" mode="aspectFit"  alt="">
          <span>{{item.name}}</span>
          <span class="alias" v-if="item.alias[0]">({{item.alias[0]}})</span>
          <!-- <span class="el-icon-arrow-right arrow"></span> -->
          <img v-lazy="item.identityIconUrl" mode="widthFix" class="arrow" alt="">
        </div>
        </div>
        <div class="album"  v-if="currentTap == 10">
          <div class="album-item" @click="goURL(10,item)" :class="{odd:index%2 == 0}" v-for="(item,index) in search.albums" :key="item.id">
            <img v-lazy="item.picUrl" mode="widthFix" alt="">
            <span>{{item.name}}</span>
            <span class="name" @click="goURL(2,item)">{{item.artist.name}}<span class="alias" v-if="item.artist.alia[0]">({{item.artist.alia[0]}})</span></span>
            
          </div>
        </div>
        <div class="MV"  v-if="currentTap == 1004">
          <div class="MV-item" v-for="(item,index) in search.mvs" :key="index">
            <img v-lazy="item.cover" @click="goURL(1004,item)" mode="widthFix" alt="">
            <p @click="goURL(1004,item)">{{item.name}}</p>
            <p @click="goURL(1)">{{item.artistName}}</p>
          </div>
        </div>
        <div class="playList">
          <div class="playList-item" @click="goURL(1000,item)" :class="{odd:index%2 == 0}" v-for="(item,index) in search.playlists" :key="item.id">
            <img v-lazy="item.coverImgUrl" mode="widthFix" alt="">
            <!-- <span class="playList-name">{{item.name}}</span> -->
            <p class="playList-name">{{item.name}}</p>
            <span class="count">{{item.trackCount}}首</span>
            <span class="by">by</span>
            <span class="name">{{item.creator.nickname}}</span>
          </div>
        </div>
        <div class="userprofile" v-if="currentTap == 1002">
          <div class="userprofile-item" @click="goURL(1002,item)" :class="{odd:index%2 != 0}" v-for="(item,index) in search.userprofiles" :key="item.id">
            <img v-lazy="item.avatarUrl" mode="widthFix" alt="">
            <img v-if="item.avatarDetail" class="avatar-icon" mode="widthFix" :src="item.avatarDetail.identityIconUrl" alt="">
            <span>{{item.nickname}}</span>
            <span class="name">{{item.description}}</span>
            <span class="iconfont icon-nan1 nan" v-if="item.gender == 1"></span>
            <span class="iconfont icon-nv nv" v-if="item.gender == 2"></span>
          </div>
        </div>
        <div class="paging" v-if="loading == false&&currentTap != 1">
            <el-pagination
            background
            layout="prev, pager, next"
            :hide-on-single-page="search.songCount<20||search.albumCount<20||search.artistCount<20||search.playlistCount<20||search.userprofileCount<20"
            :pager-count="9"
            :current-page="current"
            :page-size="this.limit"
            @next-click="next()"
            @prev-click="prev()"
            @current-change="currentPage"
            :total="search.mvCount>10000?search.mvCount/10:search.mvCount||search.albumCount||search.artistCount||search.playlistCount||search.userprofileCount">
            </el-pagination>
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
      // 默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
      total:'300首',
      type:'单曲',
      currentTap:1,
      keywords:String,
      bestMatch:Object,
      search:Object,
      offset:0,
      loading:true,
      current:1,
      // 英文名
      Type:[
        {
          type:1,
          value:'单曲'
        },
        {
          type:100,
          value:'歌手'
        },
        {
          type:10,
          value:'专辑'
        },
        {
          type:1004,
          value:'视频'
        },
        {
          type:1000,
          value:'歌单'
        },
        {
          type:1002,
          value:'用户'
        },
        ],
      limit:100,
    }
  },
  created() {
    this.$store.state.searchFlag = false;
    this.loading = true;
    this.currentTap = this.$store.state.searchCurrentTap;
    this.keywords = this.$route.query.keywords;
    console.log(this.keywords);
  },
  beforeDestroy() {
    this.$store.state.searchCurrentTap = this.currentTap;
    this.loading = true;
  },
  methods: {
    getCurrent(type) {
      if(type == this.currentTap) return;
      this.offset = 0;
      this.currentTap = type;
      this.current = 1;
      // 1:单曲显示100 100:歌手 10:专辑 1000:歌单 1002:用户显示20 1014:视频显示24
      if(type == 1) {
        this.limit = 100;
      }
      if(type == 1004){
        this.limit = 24;
      }
      if(type==10||type == 100||type == 1000||type ==1002) {
        this.limit = 20;
      }
      console.log(type);
      console.log(this.limit);
      this.getData();
    },
    currentPage(current) {
      this.offset = current-1;
      this.current = current;
      this.getData();
      // console.log(current);
    },
    next() {
      this.offset += this.offset;
      this.getData();
    },
    prev() {
      this.offset -= this.offset;
      this.getData();
    },
    playMusic(id,picId,name,singerName) {
      let url = null;
      axios.get('/song/url?id='+id).then((res)=>{
            url = res.data.data[0].url;
            console.log(res);
            this.$store.state.url = url;
            this.$store.state.picUrl = this.bestMatch.artist[0].img1v1Url;
            this.$store.state.singname = name;
            this.$store.state.singer = singerName;
            this.$store.state.musicPlay = true;
            this.$store.state.flag = true;
            this.$store.state.musicID = id;
      });
    },
    goURL(type,item) {
      if(type == 1) {
       this.$router.push({path:'/singerDetail', query: {id:this.bestMatch.artist[0].id}})
      }
      if(type == 2) {
        this.$router.push({path:'/singerDetail', query: {id:item.artists[0].id}})
      }
      if(type == 10) {
        this.$router.push({path:'/singerAlbum',query:{id:item.id}})
      }
      if(type == 1004) {
       this.$router.push({path:'/mvSon', query: {item:item,avatar:this.bestMatch.artist[0].img1v1Url,id:item.id}})
      }
      if(type == 1000) {
       this.$router.push({path: '/singList', query: {id:item.id}})
      }
      if(type == 1002) {
        this.$router.push({path: '/infoMsg', query: {id:item.userId,mine:false}})
      }
    },
    getData() {
      axios.get('/search?keywords= '+ this.keywords +'&limit='+ this.limit +'&type='+ this.currentTap +'&param=130y130&offset='+ this.offset +'').then((res)=>{
        document.documentElement.scrollTop = 0;
        this.search = res.data.result;
      // 1:单曲显示100 100:歌手 10:专辑 1000:歌单 1002:用户显示20 1014:视频显示24
        this.pageShow = false;
        this.loading = true;
        setTimeout(()=> {
          this.loading = false;
        },300)
        if(this.search.songCount) {
          this.total = this.search.songCount + '首';
          this.type = "单曲";
          // this.currentTap = 1;
        }
        if(this.search.artistCount) {
          this.total = this.search.artistCount + '位'
          this.type = "歌手";
          // this.currentTap = 100;
        }
        if(this.search.albumCount) {
          this.total = this.search.albumCount + '张'
          this.type = "专辑";
          // this.currentTap = 10;
        }
        if(this.search.mvCount) {
          this.total = this.search.mvCount + '个'
          this.type = "视频";
          // this.currentTap = 1004;
        }
        if(this.search.playlistCount) {
          this.total = this.search.playlistCount + '个'
          this.type = "歌单";
          // this.currentTap = 1000;
        }
        if(this.search.userprofileCount) {
          this.total = this.search.userprofileCount + '位'
          this.type = "用户";
          // this.currentTap = 1002;
        }
        console.log('搜索:',this.search);
      });
      if(this.currentTap == 1) {
        axios.get('/search/multimatch?keywords= '+ this.keywords +'&param=130y130').then((res)=>{
        this.bestMatch = res.data.result;
        console.log('多重匹配:',this.bestMatch);
        });
      }
      
    },
    getTime(time) {
      let second = Math.floor(time / 1000);
      let min = Math.floor(second / 60 % 60);
      let sec = Math.floor(second % 60);
      return (min >= 10?min:'0'+ min) + ':' + (sec >= 10?sec:'0' + sec);
    },
  },
  mounted(){
    this.getData();
  },
  watch :{
      '$route': function (to, from) {
        // console.log(1);
        this.getData();
        this.$router.go(0)
      }
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/index';
.search {
  @extend %main;
  width: 60% !important;
  // height: 1000px;
  // background-color: red;
  .searchTip{
    font-size: 30px;
    font-weight: 700;
    color: $b-first;
  }
  .main {
    .top {
      margin: 35px 0;
      display: flex;
      width: 1200px;
      // background: black;
      height: 40px;
      .top-item {
        // background: black;
        line-height: 40px;
        font-size: 20px;
        color: $b-second;
        margin-right: 60px;
        cursor: pointer;
        &:hover {
          color: black;
        }
      }
      .currentTap {
        border-bottom: 5px solid red;
        padding-bottom: 7px;
        text-decoration: none;
        color: rgba(0, 0, 0, 0.801);
        font-weight: 700;
        font-size: 25px;
      }
    }
    .loading {
      // background: black;
      margin-top: 50px;
      height: 650px;
      width: 100%;
      color: black;
      
    }
    .content {
      position: relative;
      .bestMatch {
      width: 600px;
      height: 180px;
      // background-color: red;
      position: relative;
      .title {
        width: 100px;
        padding: 15px 0;
        font-size: 18px;
        font-weight: 700;
        color:$b-first;
      }
      .bestMatch-item {
        background-color: $bd-fourth;
        cursor: pointer;
        img {
          width: 130px;
          // height: 150px;
        }
        span {
          // width: 600px;
          position: relative;
          top: -60px;
          left: 30px;
          font-size: 20px;
          vertical-align:middle
        }
        .alias {
          // left: 54%;
          left: 35px;
          color: $b-third;
        }
        .arrow {
          left: 160px;
          font-size: 30px;
          color: $b-fourth;
        }
      }
    }
    .songList {
        // background-color: black;
        height: 100px;
        margin-top: 20px;
        border-top: 1px solid $bd-fourth;
        width: 1200px;
        .singList-table {
        %tag {
          &>div {
            font-size: 20px;
          }
          .tags0{
            width: 110px;
            margin-left: 20px;
            color:$b-fourth
            /* background: lightgray; */
          }
          .tags1{
            width:350px;
            /* background: lightblue; */
            color: $b-first;
          }
          .tags2{
            width: 250px;
            /* background: green; */
            color: $b-second;
          }
          .tags3{
            width: 280px;
            /* background: greenyellow; */
            color: $b-second;
          }
          .tags4{
            width: 119px;
            /* background: hotpink; */
            color: $b-third;
          }
        }
        .table-th{
          // background-color: red;
          margin-top: 10px;
          padding-left: 130px;
          @extend %tag;
          &>div {
            height: 45px;
            text-align: left;
            line-height: 45px;
            padding-left: 5px;
            display: inline-block;
            color: $b-second;
            font-size: 20px;
          }
          // &>div:hover {
          //   background: rgba(128, 128, 128, 0.123);
          //   cursor: pointer;
          // }
        }
        .table-tr {
          @extend %tag;
          &>div {
            display: inline-block;
            height: 45px;
            text-align: left;
            line-height: 45px;
            padding-left: 3.5px;
            flex-wrap: nowrap;
            overflow: hidden;
            text-overflow:ellipsis;
          }
          &:hover {
            background:rgba(128, 128, 128, 0.123) ;
            cursor: default;
          }
        }
      }
      }
    .artists {
      .artist-item {
        cursor: pointer;
        margin-bottom: 20px;
        position: relative;
        width: 1200px;
        &:hover {
          background:rgba(128, 128, 128, 0.123) ;
        }
        img {
          width: 100px;
          height: 100px;
        }
        span {
          position: relative;
          top: -40px;
          left: 20px;
          font-size: 20px;
          vertical-align:middle
        }
        .alias {
          color: $b-third;
        }
        .arrow {
          position: absolute;
          left: 95% ;
          // font-size: 30px;
          color: $b-fourth;
          top: 47% ;
          width: 25px !important;
          height: 25px !important;
        }
      }
      .even {
        background-color: $bd-fourth;
      }
    }
    .album {
      .album-item {
        width: 1200px;
        cursor: pointer;
        margin-bottom: 20px;
        position: relative;
        img {
          width: 100px;
        }
        span {
          position: relative;
          top: -40px;
          left: 30px;
          font-size: 20px;
          vertical-align:middle
        }
        $span-left:640px;
        .name {
          position:absolute;
          left: $span-left;
          top: 45%;
          color: rgba(0, 0, 255, 0.514);
        }
        .alias {
          margin-left: 5px;
          left: 0px !important;
          top: 0px !important;
          color: $b-third;
          font-size: 18px;
        }
        &:hover {
          background:rgba(128, 128, 128, 0.123) ;
        }
      }
      .even {
        background-color: $bd-fourth;
      }
    }
    .MV {
      display: flex;
      justify-content: flex-start;
      // justify-content: space-around;
      flex-wrap: wrap;
      width: 1200px;
      &>div {
        width: 30%;
        margin-bottom: 20px;
      }
      .MV-item {
        cursor: pointer;
        margin-right: 30px;
        img {
          width: 350px;
          height: 205px;
          border-radius: 5px;
        }
        &>p:last-child{
          color: $b-third;
        }
        p {
          margin-top: 10px;
        }
      }
    }
    .playList {
      .playList-item {
        $left:30%;
        width: 1200px;
        cursor: pointer;
        margin-bottom: 20px;
        position: relative;
        &:hover {
          background:rgba(128, 128, 128, 0.123) ;
        }
        img {
          width: 90px;
          height: 90px;
        }
        span {
          position: relative;
          top: -40px;
          left: 30px;
          font-size: 20px;
          vertical-align:middle
        }
        p {
          position: relative;
          top: -60px;
          left: 110px;
          font-size: 20px;
          vertical-align:middle
        }
        $span-left:640px;
        .count {
          position: absolute;
          left: $span-left;
          top: $left;
          color: $b-third;
          font-size: 18px;
          font-weight: 100;
        }
        .by {
          position: absolute;
          left: $span-left + 173px;
          color: $b-fourth;
          top: $left;
        }
        .playList-name {
          width: 500px;
          @extend %overflow;
        }
        .name {
          position: absolute;
          left: $span-left + 200px;
          top: $left;
        }
      }
    }
    .userprofile {
      .userprofile-item {
        width: 1200px;
        cursor: pointer;
        margin-bottom: 20px;
        position: relative;
        img{
            width: 100px;
            border-radius: 50%;
        }
        .avatar-icon {
          width: 30px !important;
          position: absolute;
          bottom: 10px;
          left: 75px;
        }
        span {
          position: relative;
          top: -40px;
          left: 30px;
          font-size: 20px;
          vertical-align:middle
        }
        $span-left:640px;
        .name {
          position: absolute;
          left: $span-left + 400px;
          top: 47%;
          font-size: 16px;
          color: $b-third;
        }
        .gender-p {
          position: relative;
          left: 45px;
          top: -40px;
        }
        .nan {
          @extend .gender-p;
          font-size: 16px;
          background: rgba(135, 207, 235, 0.459);
          color: rgb(107, 190, 223);
          border-radius: 50%;
          padding: 5px;
        }
        .nv {
          @extend .gender-p;
          font-size: 16px;
          color: rgb(235, 79, 105);
          padding: 5px;
          border-radius: 50%;
          background: rgb(255, 188, 198);
        }
        .alias {
          position: absolute;
          top: 47%;
          left: $span-left+125px;
          color: $b-third;
        }
        &:hover {
          background:rgba(128, 128, 128, 0.123) ;
        }
      }
    }
    .paging {
              position: absolute;
              bottom: -40px;
              left: 30%;
            }
    }
    }
    
}
</style>