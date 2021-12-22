<template>
  <div class="singer-album">
    <div class="singList-header">
        <div class="singList-pic">
            <img :src="album.picUrl">
        </div>
        <div class="singList-text">
            <div class="singList-title">
                <div class="slogo">
                  专辑
                </div>
                <div class="title">
                    {{album.name}}
                </div>
            </div>
            <div class="singList-function">
              <div class="function1 bg-red white">
                播放全部
              </div>
              <div class="function2">
                收藏
              </div>
              <div class="function3">
                分享
              </div>
              <div class="function4">
                下载全部
              </div>
            </div>
            <div class="singList-detail">
               <div class="inline">歌手: 
                 <p class="text-blue" v-for="(item,index) in album.artists" :key="index">
                   <router-link :to="{path:'/singerDetail',query:{id:item.id}}">
                    {{ index >= 1 ? "/" + item.name : item.name }}
                   </router-link>
                 </p>
                </div>
               <div>
                 时间：{{createdTime}}
                </div>
            </div>
        </div>
    </div>
    <div class="singList-content" ref="content">
      <div class="singList-top">
        <div :class="{current:currentIndex == 1}" @click="current(1)">歌曲列表</div>
        <div :class="{current:currentIndex == 2}" @click="current(2)">评论({{commentCount}})</div>
        <div :class="{current:currentIndex == 3}" @click="current(3)">专辑详情</div>
      </div>
      <div class="singList-table">
        <div class="table-th">
            <div class="tags1">音乐标题</div>
            <div class="tags2">歌手</div>
            <div class="tags3">专辑</div>
            <div class="tags4">时长</div>
          </div>
          <div class="table-tr" :class="{odd:index%2 == 0}" @dblclick="playMusic(item.id,item.al.picUrl,item.name,item.ar[0].name)" v-for="(item,index) in songs" :key="index">
            <div class="tags0">{{index+1>=10?index + 1:'0' + (index + 1)}}</div>
            <div class="tags1">{{item.name}}</div>
            <div class="tags2">{{item.ar[0].name}}</div>
            <div class="tags3">{{item.al.name}}</div>
            <div class="tags4">{{getTime(item.dt)}}</div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import {formatDate} from '../data/data.js'
export default {
  props: {
  },
  data(){
    return{
        id:null,
        pic:null,
        createdTime:null,
        flag:true,
        currentIndex:1,
        songId:[],
        song:[],
        album:[],
        commentCount:Number,
        songs:[]
    }
  },
  computed:{
  },
  created() {
       this.id = this.$route.query.id;
  },
  methods: {
    change() {
      this.flag = !this.flag;
      let content = this.$refs.content;
      let deg = this.$refs.description;
      setTimeout(function() {
        content.style.top = deg.offsetHeight + 80 + 'px';
        // console.log(content);
      },20)
    },
    current(index) {
      this.currentIndex = index;
    },
    getId() {
      axios.get('/song/url?id='+this.songId).then((res)=>{
          // console.log('oth:',res);
      });
      axios.get('/song/detail?ids='+this.songId).then((res)=>{
        this.song = res.data.songs;
          // console.log('song:',res);
      });
    },
    playMusic(id,pic,name,singerName) {
      let url = null;

      // 判断音乐是否可用
      axios.get("/check/music?id=" + id).then(res => {
        console.log('该音乐可用',res);
        
        // 播放音乐
        axios.get('/song/url?id='+id).then((res)=>{
          console.log('playsingeralbum',res);
          url = res.data.data[0].url;
          this.$store.state.url = url;
          this.$store.state.picUrl = pic;
          this.$store.state.singname = name;
          this.$store.state.singer = singerName;
          this.$store.state.musicPlay = true;
          this.$store.state.flag = true;
        }).catch(err => {
          console.log('当前音乐播放失败',err);
        })
      }).catch(err => {
        alert('该音乐为付费音乐',err);
      })
    },
    getTime(time) {
      let second = Math.floor(time / 1000);
      let min = Math.floor(second / 60 % 60);
      let sec = Math.floor(second % 60);
      return (min >= 10?min:'0'+ min) + ':' + (sec >= 10?sec:'0' + sec);
    },
  },
  mounted(){
    let time = new Date().getTime();
    axios.get('http://localhost:3000/album?id=' + this.id).then(res => {
      console.log('singeralbum',res);
      this.album = res.data.album;
      this.songs = res.data.songs;
      let _this = this;
      this.createdTime = formatDate(new Date(this.album.publishTime), 'yyyy-MM-dd');
    })
    axios.get('http://localhost:3000/album/detail/dynamic?id=' + this.id).then(res => {
      // console.log('albummessage',res);
      this.commentCount = res.data.commentCount;
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/index';
.singer-album{
  width: 61%;
  // height: 1500px;
  /* background: red; */
  margin: 0 auto;
  border-left: 1px solid rgba(0, 0, 0, 0.178);
  color: rgba(0, 0, 0, 0.671)
}
.singList-header{
    width: 90%;
    position: relative;
    top: 40px;
    left: 40px;
    /* background: green; */
    /* background: rgba(128, 128, 128, 0.253); */
}
.singList-pic{
    width:250px;
    height:250px;
    border: 1px solid rgba(0, 0, 0, 0.199);
    padding: 4px;
}
.singList-pic img{
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.over {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.singList-text{
  position: absolute;
  top: 10px;
  left: 280px;
  height:250px;
}
.slogo{
  color: rgba(255, 0, 0, 0.808);
  padding: 4px;
  width: 35px;
  text-align: center;
  border: 1px solid rgba(255, 0, 0, 0.808);
}
.singList-title>div{
  display: inline-block;
}
.author-detail>div{
  display: inline-block;
  margin-top: 10px;
}
.title{
  font-size: 30px;
  margin-left: 20px;
  font-weight: 700;
}
.author-pic{
  width: 30px;
  height: 30px;
  border-radius: 100%;
  margin-right: 10px;
}
.author-pic>img{
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: 50%;
}
.author-nickname{
  position: relative;
  top: -10px;
}
.author-nickname>p{
  display: inline-block;
  font-size: 18px;
  margin-right: 10px;
}
.text-blue{
  color: rgba(0, 0, 255, 0.514);
}
.singList-function{
  margin: 18px 0px;
}
.singList-function>div{
  display: inline-block;
  width: 150px;
  height: 50px;
  margin-right: 20px;
  border-radius: 40px;
  border: 1px solid rgba(0, 0, 0, 0.404);
  text-align: center;
  line-height: 50px;
}
.singList-function>div:hover{
  opacity: 0.8;
}
.bg-red{
  background: rgba(255, 0, 0, 0.767);
}
.white{
  color: white;
}
.inline>p{
  display: inline-block;
  margin-right: 10px;
}
.singList-detail>div{
  font-size: 18px;
  margin-bottom: 10px;
  color: rgba(0, 0, 0, 0.671);
}
.font-color{
  color: rgba(0, 0, 0, 0.671);
}
.description{
  width: 650px;
}
.over-logo{
  position: absolute;
  left: 650px;
  top: 220px;
  cursor: pointer;
}


.singList-content{
  position: relative;
  top: 100px;
  left: 40px;
  /* background: rgba(128, 128, 128, 0.082); */
  // height: 2000px;
}
.singList-top>div{
  margin: 15px 20px;
  padding-bottom: 10px;
  display: inline-block;
  font-size: 20px;
  cursor: pointer;
}
.current{
  font-weight: 600;
  border-bottom: 3px solid red;
  color: rgba(0, 0, 0, 0.815);
}

.singList-table{
  width: 100%;
  /* background: cadetblue; */
  // height: 1000px;
  font-size: 18px;
  padding-bottom: 80px;
}
.table-th{
  padding-left: 130px;
}
.table-th>div{
  height: 45px;
  text-align: left;
  line-height: 45px;
  padding-left: 5px;
  display: inline-block;
}
.table-th>div:hover{
  background: rgba(128, 128, 128, 0.123);
  cursor: pointer;
}
.tags0{
  width: 110px;
  margin-left: 20px;
  /* background: lightgray; */
}
.tags1{
  width:350px;
  /* background: lightblue; */
}
.tags2{
  width: 250px;
  /* background: green; */
}
.tags3{
  width: 280px;
  /* background: greenyellow; */
}
.tags4{
  width: 119px;
  /* background: hotpink; */
}
.table-tr>div{
  display: inline-block;
  height: 45px;
  text-align: left;
  line-height: 45px;
  padding-left: 3.5px;
  flex-wrap: nowrap;
  overflow: hidden;
  text-overflow:ellipsis;
}
.table-tr:hover{
  background:rgba(128, 128, 128, 0.123) ;
  cursor: default;
}
</style>