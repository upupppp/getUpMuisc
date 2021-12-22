<template>
  <div class="singerDetail" >
    <div class="detail">
      <img :src="detail.img1v1Url" v-if="detail.img1v1Url!== null" alt="">
      <div class="word">
        <h1>{{detail.name}}</h1>
        <p v-for="(item,index) in detail.alias" :key="index">
          {{item}}
        </p>
        <div>
          <p>单曲数:{{detail.musicSize}}</p>
          <p>专辑数:{{detail.albumSize}}</p>
          <p>MV数:{{detail.mvSize}}</p>
        </div>
        <div class="getClick" @click="haveGood()">
          <span class="el-icon-goods"></span> 收藏
        </div>
      </div>
    </div>
    <div class="Smain">
      <div>
        <router-link :to="{path: '/singerDetail/album', query: {id:id}}">
        专辑
        </router-link>
      </div>
      <div>
        <router-link :to="{path: '/singerDetail/MV', query: {id:id,avatar:avatar}}">
        MV
        </router-link>
      </div>
      <div>
        <router-link :to="{path: '/singerDetail/detail', query: {id:id}}">
        歌手详情
        </router-link>
      </div>
      <div>
        <router-link :to="{path: '/singerDetail/artist', query: {id:id}}">
        相似歌手
        </router-link>
      </div>
      <!-- <div :class="{currentTap:currentTap == 1}" @click="goSon(1)">
        专辑
      </div>
      <div :class="{currentTap:currentTap == 2}" @click="goSon(2)">
        MV
      </div>
      <div :class="{currentTap:currentTap == 3}" @click="goSon(3)">
        歌手详情
      </div>
      <div :class="{currentTap:currentTap == 4}" @click="goSon(4)">
        相似歌手
      </div > -->
        <router-view/>
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
      id:null,
      detail:[],
      avatar:String,
      currentTap:1,
    }
  },
  created() {
       this.id = this.$route.query.id;
      //  addEventListener('click', this.click, false)
       document.documentElement.scrollTop = 0;
  },
  beforeDestroy() {
    removeEventListener('click', this.click, false)
  },
  methods: {
    haveGood() {
      let timer = new Date().getTime();
      let cookie = localStorage.getItem('cookie');
      // let t = !followed?1:0;
      let t = 1;
      axios.get('/artist/sub?id='+ this.id +'&t='+ t +'&cookie='+ cookie +'&timestamp='+ timer +'').then((res)=>{
          console.log(res);
      });
    },
    // goSon(index) {
    //   if(index == 1) {
    //     this.$router.push({path: '/singerDetail/album', query: {id:this.id}})
    //     this.currentTap = 1;
    //   }
    //   if(index == 2) {
    //     this.$router.push({path: '/singerDetail/MV', query: {id:this.id,avatar:this.avatar}})
    //     this.currentTap = 2;
    //   }
    //   if(index == 3) {
    //     this.$router.push({path: '/singerDetail/detail', query: {id:this.id}})
    //     this.currentTap = 3;
    //   }
    //   if(index == 4) {
    //     this.$router.push({path: '/singerDetail/artist', query: {id:this.id}})
    //     this.currentTap = 4;
    //   }
    // }
  },
  mounted(){
    axios.get('/artists?id= '+ this.id +'').then((res)=>{
          console.log(res);
          this.detail = res.data.artist;
          this.avatar = res.data.artist.img1v1Url;
          this.id = res.data.artist.id;
          this.$store.state.imgUrl = this.detail.picUrl;
    });
    }
}
</script>

<style lang="scss" scoped>
.singerDetail{
  user-select: none;
  width: 60%;
  margin: 0 auto;
  margin-top: 40px;
  .detail {
    .word 
    {
      position: relative;
      top: -280px;
      left: 330px;
      h1{
      font-size: 30px;
      font-weight: 1000;
      color: rgba(0, 0, 0, 0.801);
      }
      h1,p{
      margin-bottom: 20px;
      }
      p {
      font-size: 18px;
      color: rgba(0, 0, 0, 0.794);
      }
      div p{
      display: inline-block;
      margin-right: 30px;
      }
      .getClick {
      width: 150px;
      height: 50px;
      border-radius: 40px;
      border: 1px solid rgba(0, 0, 0, 0.404);
      text-align: center;
      line-height: 50px;
      cursor: pointer;
      }
    }
    img{
    width: 280px;
    border-radius: 5px;
    }
  }
  .Smain {
    width: 1000px;
    margin-top: 25px;
    // position: absolute;
    // top: 430px;
    // left: 390px;
    position: relative;
    top: -150px;
    // top: -150px;
    &>div{
      // cursor: pointer;
      display: inline-block;
      font-size: 20px;
      color: rgba(0, 0, 0, 0.931) !important;
      margin-right: 30px;
    }
    // .currentTap {
    //   border-bottom: 5px solid red;
    //   padding-bottom: 7px;
    //   text-decoration: none;
    //   color: rgba(0, 0, 0, 0.801);
    // }
  }
}
.router-link-active{
  border-bottom: 5px solid red;
  padding-bottom: 7px;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.801);
}
a {
  text-decoration: none;
}
</style>