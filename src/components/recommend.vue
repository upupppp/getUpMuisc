<template>
  <div class="recommend">
    <div class="recommend-header">

    </div>
    <div class="recommend-content">
        <div class="content1">
          <div class="contentTitle" id="hr">
            <div><img src="~@/assets/img/圆圈.png" alt=""></div>
            <div class="big">热门推荐</div>
          </div>
          <div class="contentMain">
            <div class="MainsList" v-for="(item,index) in personalized" :key="index">
              <div class="MainsList-img" >
                <router-link :to="{path: '/singList', query: {id:item.id}}"><img :src="item.picUrl" alt=""></router-link>
                <div class="MainsList-playCount">
                <div class="small-logo"><img src="~@/assets/img/耳机.png" alt=""></div>
                <div>{{item.playCount}}</div>
              </div>
              </div>
              <div class="MainsList-text" >
                <router-link :to="{path: '/singList', query: {id:item.id}}" >{{item.name}}</router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="content2">
          <div class="contentTitle" id="hr">
            <div><img src="~@/assets/img/圆圈.png" alt=""></div>
            <div class="big">独家放送</div>
          </div>
          <div class="contentMain">
            <div class="MainsList" v-for="(item,index) in privatecontent" :key="index">
              <div class="MainsList2-img">
                <img :src="item.picUrl" alt="">
              </div>
              <div class="MainsList-text">
                <p>{{item.name}}</p>
              </div>
            </div>
          
          </div>
        </div>
        <div class="content3">
          <div class="contentTitle" id="hr">
            <div><img src="~@/assets/img/圆圈.png" alt=""></div>
            <div class="big">最新音乐</div>
          </div>
          <div class="contentMain">
            <div class="MainsList" v-for="(item,index) in newsong" :key="index">
              <div class="main-img">
                <img :src="item.picUrl" alt="">
              </div>
              <div class="playBtn">
                <img @click="playMusic(item,item.song.id)" src="~@/assets/img/播放.png" alt="">
              </div>
              <div class="main-text">
                <div class="over">{{item.name}}</div>
                <div class="text-singer" v-for="(songs,songIndex) in item.song.artists" :key="songIndex">
                  <p>{{songs.name}} </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content4">
          <div class="contentTitle" id="hr">
            <div><img src="~@/assets/img/圆圈.png" alt=""></div>
            <div class="big">推荐mv</div>
          </div>
          <div class="contentMain">
            <div class="MainList" v-for="(item,index) in mvList" :key="index">
              <div class="MainList-img">
                <img :src="item.picUrl" alt="">
              </div>
              <div class="MainList-text">
                <div class="singerName">
                  {{item.name}}
                </div>
                <div class="name grey">
                  {{item.artistName}}
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  components:{
  },
  props: {
  },
  data(){
    return{
      personalized:[],
      privatecontent:[],
      newsong:[],
      mvList:[],
    }
  },
  created() {
        
  },
  methods: {
    playMusic(song,id) {
      let url = null;
      axios.get('https://autumnfish.cn/song/url?id='+id).then((res)=>{
            url = res.data.data[0].url;
            this.$store.state.url = url;
            this.$store.state.picUrl = song.picUrl;
            this.$store.state.singer = song.song.artists[0].name;
            this.$store.state.singname = song.name;
            console.log(song);
            this.$store.state.musicPlay = true;
            this.$store.state.flag = true;
      });
    }
  },
  mounted(){
    axios.get('https://autumnfish.cn/personalized?limit=8').then((res)=>{
      this.personalized = res.data.result;
          console.log(this.personalized);
    });
    axios.get('https://autumnfish.cn/personalized/privatecontent').then((res)=>{
      this.privatecontent = res.data.result;
          console.log(this.privatecontent);
    });
    axios.get('https://autumnfish.cn//personalized/newsong?limit=12').then((res)=>{
      this.newsong = res.data.result;
    });
    axios.get('https://autumnfish.cn/personalized/mv').then((res)=>{
      this.mvList = res.data.result;
          console.log(this.mvList);
    });
    }
}
</script>

<style>
.recommend-header{
  width: 60%;
  height: 350px;
  background: red;
  margin: 0 auto;
}
.recommend-content{
  padding-top: 20px;
  width: 58%;
  margin: 0 auto;
}
.contentTitle{
  width: 95%;
  margin-left: 30px;
}
#hr{
  border-bottom: 2px solid rgba(202, 26, 26, 0.788);
}
.contentTitle>div{
  display: inline-block;
  padding: 10px 5px 10px 5px;
}
.big{
  font-size: 25px;
  font-weight: 300;
}
.contentTitle img{
  width: 20px;
}
.content1{
  width: 100%;
}
.content1 .contentMain{
  display: flex;
  justify-content: space-around;
  flex-wrap:wrap;
}
.content1 .contentMain>div{
  margin: 20px 20px 170px 20px;
  width: 20%;
  height: 100px;
  cursor: pointer;
}
.content1 .MainsList-img{
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
.MainsList-img img{
  width: 180px;
}
.content1 .MainsList-text{
  position: relative;
  top: 95px;
}
.content1 .MainsList-text:hover{
  text-decoration: underline;
}
.content1 .MainsList-playCount{
  position: relative;
  background: rgba(7,17,27,0.8);
  width: 180px;
  height: 35px;
  color: rgba(255, 255, 255, 0.829);
  opacity:0.65;
  top: -38px;
  text-align: center;
  line-height: 35px;
  cursor:default !important;
}
.content1 .MainsList-playCount>div{
  display: inline-block;
  margin-right: 10px;
}
.content1 .small-logo img{
  width: 15px;
}



.content2{
  width: 100%;
}
.content2 .contentMain{
  display: flex;
  justify-content: space-around;
}
.content2 .contentMain>div {
  margin: 20px 20px 20px 30px;
  width:30%;
}
.content2 .MainsList2-img img{
  width: 100%;
}
.content2 .MainsList-text{
  position: relative;
  top: 15px;
  cursor: pointer;
}
.content2 .MainsList-text:hover{
  text-decoration: underline;
}


.content3{
  width: 100%;
  margin-top: 30px;
}
.content3 .contentMain{
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 100%;
}
.content3 .contentMain>div{
  height: 80px;
  width: 29%;
  margin: 20px 5px 10px 15px;
  border-radius: 5px;
}
.content3 .contentMain>div:hover{
  background: rgba(128, 128, 128, 0.301);
}
.content3 .main-img{
  width: 80px;
  cursor: pointer;
}
.main-img img{
  width: 100%;
  width: 100%;
  max-height: 100%;
  max-width: 100%;
  border-radius: 5px;
}
.over{
  width: 210px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.main-text{
  position: relative;
  top: -115px;
  left: 90px;
  font-size: 18px;
}
.main-text>div{
  margin-bottom: 25px;
}
.text-singer{
  display: inline-block;
  color: rgba(128, 128, 128, 0.76);
}
.text-singer:hover{
  color: rgba(0, 0, 0, 0.616);
  cursor: pointer;
}


.content4{
  width: 100%;
  margin-top: 30px;
}
.content4 .contentMain{
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.content4 .contentMain>div{
  width: 45%;
  margin: 20px 20px 40px 20px;
}
.content4.MainsList-img{
  width: 200px;
}
.MainList-img img{
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  cursor: pointer;
}
.MainList-text>div{
  margin-top: 15px;
  font-size: 19px;
  cursor: pointer;
}
.MainList-text>div:hover{
  color: rgba(0, 0, 0, 0.788);
}
.grey{
  color: rgba(0, 0, 0, 0.609);
}

.playBtn{
  width: 40px;
  position: relative;
  top: -60px;
  left: 20px;
  cursor: pointer;
}
.playBtn img{
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
}
</style>