<template>
  <div class="new-disc-grounding">
    <!-- 热门新碟 -->
    <div class="hot-new-disc">
      <div class="hot-new-disc-text">
        <p>热门新碟</p>
      </div>
      <!-- 热门新碟展示 -->
      <div class="hot-new-disc-list">
        <div class="disc" v-for="(item, index) in disc" :key="index">
          <div class="play-logo2">
            <img @click="playLogo2(item,item.id)" src="~@/assets/img/播放.png" mode="widthFix" alt="">
          </div>
          <div class="album-cover">
            <img v-lazy="item.picUrl" alt="" />
          </div>
          <div class="hot-new-album-name">
            <router-link :to="{path:'/singerAlbum',query:{id:item.id}}">
              {{item.name}}
            </router-link>
          </div>
          <div class="hot-new-singer">
            <span v-for="(item, index) in item.artists" :key="index">
              <router-link :to="{path:'/singerDetail',query:{id:item.id}}">
                {{ index > 1 ? "/" + item.name : item.name }}
              </router-link>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- allsong -->
    <div class="languages">
      <div class="allsong">
        <div class="allsong-choose"
          @click="itemAllDiscs(index)" v-for="(item, index) in languages"
          :key="index" :class="{active2:isActive2 == index}">
          {{ item }}
        </div>
      </div>
    </div>
    <!-- 全部新碟 -->
      <div class="all-new-discs">
        <div class="discs" v-for="(item,index) in discs" :key="index">
          <div class="play-logo2">
            <img @click="playLogo2(item,item.id)" src="~@/assets/img/播放.png" alt="">
          </div>
          <div class="all-new-discs-cover">
            <img :src="item.picUrl" alt="">
          </div>
          <div class="all-new-discs-name">
            <router-link :to="{path:'/singerAlbum',query:{id:item.id}}">
              {{item.name}}
            </router-link>
          </div>
          <div class="all-new-discs-singer">
            <span v-for="(item,index) in item.artists" :key="index">
              <router-link :to="{path:'/singerDetail',query:{id:item.id}}">
                {{ index > 1 ? "/" + item.name : item.name }}
              </router-link>
            </span>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  components: {},
  data() {
    return {
      disc:[],
      discs:[],
      newsong:[],
      languages: ["全部", "华语", "欧美", "日本", "韩国"],
      area: 'ALL',
      isActive2:0,
      id:Number
    };
  },
  methods: {
    getHotDisc() {
      axios.get("/top/album?type=hot").then((res) => {
        // console.log("disc", res);
        this.disc = res.data.weekData;
      });
    },
    getAllDiscs(){
      axios.get("/album/new?limit=100&area=" + this.area).then(res => {
        // console.log('discs',res);
        // console.log(this.area);
        this.discs = res.data.albums;
      })
    },
    playLogo2(song,id){
      console.log('song',song);
      let url = null;

      // 获取专辑里面的第一首歌的id
      axios.get("/album?id=" + id).then(res => {
        this.id = res.data.songs[0].id;
        console.log('当前专辑歌曲id',this.id);

        //判断当前音乐id是否可用 
        axios.get("/check/music?id=" + this.id).then(res => {
          console.log('该音乐可用',res);

          // 获取第一首歌的url，播放
          axios.get('/song/url?id=' + this.id).then(res => {
          console.log('playalbum',res);
          url = res.data.data[0].url;
          this.$store.state.url = url;
          this.$store.state.picUrl = song.picUrl;
          this.$store.state.singer = song.artists[0].name;
          this.$store.state.singname = song.name;
          // console.log(song);
          this.$store.state.musicPlay = true;
          this.$store.state.flag = true;
          }).catch(err => {
            console.log('当前专辑播放失败',err);
          })
        }).catch(err => {
          alert('该专辑为付费专辑',err);
        })
      }).catch(err => {
        console.log('歌曲id获取失败',err);
      })
    },
    itemAllDiscs(index){
      this.isActive2 = index;
      switch(index){
        case 0:
          this.area = 'ALL';
          this.$store.state.area = 'ALL';
          break;
        case 1:
          this.area = 'ZH';
          this.$store.state.area = 'ZH';
          break;
        case 2:
          this.area = 'EA';
          this.$store.state.area = 'EA';
          break;
        case 3:
          this.area = 'JP';
          this.$store.state.area = 'JP';
          break;
        case 4:
          this.area = 'KR';
          this.$store.state.area = 'KR';
          break;  
      }
      this.getAllDiscs();
    }
  },
  mounted() {
    this.getHotDisc();
    this.getAllDiscs();
    axios.get('/personalized/newsong?limit=100').then((res)=>{
      this.newsong = res.data.result;
      // console.log('newsong:',this.newsong)
    })
    
  }
};
</script>

<style>
/* 全局 */
.new-disc-grounding {
  width: 100%;
  margin-top: 10px;
}
/* hot-new-disc */
.hot-new-disc {
  width: 100%;
  margin: 20px 0;
}
.hot-new-disc-text {
  width: 100%;
  border-bottom: 1px solid red;
}
.hot-new-disc-text p {
  padding-bottom: 10px;
}
.hot-new-disc-list {
  height: 100%;
  margin: 20px 0 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.disc{
  width: 22%;
  padding: 10px 13px;
  margin-right: 8px;
  position: relative;
}
.disc > div{
  overflow: hidden;
  white-space: nowrap;
  flex-wrap: nowrap;
  text-overflow: ellipsis;
  align-items: flex-start;
}
.album-cover img {
  width: 250px;
  height: 250px;
  margin-bottom: 5px;
}
.hot-new-singer{
  width: 60px;
  margin: 10px 0;
}
.hot-new-album-name{
  width: 150px;
}
.hot-new-album-name router-link{
  flex-wrap: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.play-logo2{
  width: 100px;
  /* height: 100px; */
  position: absolute;
  top: 85px;
  left: 85px;
  cursor: pointer;
}
.play-logo2 img{
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
} 
/* allsong */
.languages {
  margin: 0 0 20px;
  border-bottom: 1px solid red;
}
.allsong {
  display: flex;
}
.allsong-choose {
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 0 10px 0 0;
  margin: 20px 0 10px;
}
.active2 {
  color: red;
}
/* all-new-discs */
.all-new-discs{
  height: 100%;
  margin: 20px 0 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.discs{
  width: 22%;
  padding: 10px 13px;
  margin-right: 8px;
  position: relative;
}
.discs > div{
  overflow: hidden;
  white-space: nowrap;
  flex-wrap: nowrap;
  text-overflow: ellipsis;
  align-items: flex-start;
}
.all-new-discs-cover img{
  width: 250px;
  height: 250px;
  margin-bottom: 5px;
}
.all-new-discs-name{
  width: 150px;
}
.all-new-discs-name p{
  flex-wrap: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.all-new-discs-singer{
  width: 60px;
  margin: 10px 0;
}
</style>