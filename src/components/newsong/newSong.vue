<template>
  <div class="newsong">
    <div class="nav">
      <div class="text"><router-link class="text-color" @click="itemNewAlbum(index)" v-for="(item,path,index) in newalbum" :key="index" 
      :to="{path:item.path}">{{item.name}}</router-link></div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import axios from "axios";
export default {
  props: {},
  components:{},
  data(){
    return{
      newalbum:[
        {name:'新歌速递',path:'/newSongExpress'},
        {name:'新碟上架',path:'/newDiscGrounding'}
      ]
    }
  },
  created() {},
  methods: {},
  mounted() {
    axios.get("/top/song").then((res) => {
      // console.log(res);
    });
  },
};
</script>

<style lang="scss" scoped>
  .newsong{
    width: 60%;
    margin: 0 auto;
    margin-top: 40px;
  }
  .nav{
    border: 1px solid #7e8c8d;
    border-radius: 30px;
    width: 240px;
    position: relative;
    left: 40%;
  }
  .text{
    padding: 10px 0;
    font-size: 20px;
  }
  .text-color{
    color: rgb(126, 126, 126);
    padding: 7px 20px;
  }
  .router-link-exact-active{
    border-radius: 30px;
    background: rgb(255, 0, 0);
    color: white;
  }
</style>