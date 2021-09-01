<template>
  <div id="app">
    <div id="nav">
      <div id="nav-img">
        <img src="~@/assets/img/网易云音乐-03.png" alt="">
      </div>
      <div class="item"><router-link to="/recommend" class="text-color" >推荐</router-link></div>
      <div class="item"><router-link to="/rank" class="text-color">排行榜</router-link> </div>
      <div class="item"><router-link to="/playlist" class="text-color">歌单</router-link></div>
      <div class="item"><router-link to="/radioAnchor" class="text-color">主播电台</router-link></div>
      <div class="item"><router-link to="/singer" class="text-color">歌手</router-link> </div>
      <div class="item"><router-link to="/newSong" class="text-color">新碟上架</router-link> </div>
      <router-link to="/singList"> </router-link>
    </div>
    <router-view/>
    <div class="audio-box">
      <audioBox></audioBox>
    </div>
    <div class="footer"> 
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import audioBox from './components/audio.vue'
import sass from './assets/styles/index.scss'
export default {
  components:{
    audioBox
  },
  data(){
    return{
      seller:{},
      currentSrc:'',
      id:405998841
    }
  },
  methods:{
    
  },
  mounted(){
    
  }

}
</script>
<style>
#app{
  width: 100%;
  margin: 0 auto;
}
#nav{
  width: 100%;
  display: flex;
  background: rgba(0, 0, 0, 0.815);
  justify-content: center;
}
.item{
  text-align: center;
  padding: 30px 25px 30px 25px;
}
.item:hover{
  background: black;
}
.item:hover .text-color{
  color: white;
}
#nav-img img{
  width: 80px;  
  height: 80px;  
}
.footer{
  position:relative;
  bottom: 0px;
  background: red;
  width: 100%;
  height: 200px;
  display: none;
}
</style>
