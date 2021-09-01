<template>
  <div class="singerDetail">
    <div class="singerDetail-detail">
      <img :src="detail.img1v1Url" alt="">
      <div class="detail-word">
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
          收藏d
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
      id:null,
      detail:null,
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
          this.id = res.data.artist.id;
    });
    }
}
</script>

<style>
.singerDetail{
  width: 60%;
  margin: 0 auto;
  margin-top: 40px;
}
.singerDetail-detail img{
  width: 280px;
  border-radius: 5px;
}
.detail-word {
  position: absolute;
  top: 130px;
  left: 700px;
}
.detail-word h1{
  font-size: 30px;
  font-weight: 1000;
  color: rgba(0, 0, 0, 0.801);
}
.detail-word >h1,p{
  margin-bottom: 20px;
}
.detail-word p {
  font-size: 18px;
  color: rgba(0, 0, 0, 0.794);
}
.detail-word>div p{
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
}
</style>