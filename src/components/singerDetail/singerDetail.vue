<template>
  <div class="singerDetail">
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
        <div class="getClick">
          收藏
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
    }
  },
  created() {
       this.id = this.$route.query.id;
  },
  methods: {

  },
  mounted(){
    axios.get('https://autumnfish.cn/artists?id= '+ this.id +'').then((res)=>{
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
    margin-top: 50px;
    // position: absolute;
    // top: 430px;
    // left: 390px;
    position: relative;
    top: -150px;
    top: -150px;
    &>div{
      display: inline-block;
      font-size: 20px;
      color: rgba(0, 0, 0, 0.931) !important;
      margin-right: 30px;
    }
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