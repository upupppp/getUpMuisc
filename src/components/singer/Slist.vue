<template>
  <div class="Slist">
    <div class="singer-bottom">
      <div class="singer-artists" v-for="(item,index) in artists" :key="index">
        <router-link :to="{path: '/singerDetail', query: {id:item.id}}">
        <img class="artistsPic" mode="aspectFill" :onerror="logo" :src="item.img1v1Url" >
        <p>{{item.name}}</p>
        </router-link>
      </div>
      
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  props: {
    type: {
      type:Number
    }, area: {
      type:Number
    }, 
    initial: {
    }
  },
  data(){
    return{
      artists:null,
      logo:'this.src="'+ require('../../assets/img/用户方形.png')+'"'
    }
  },
  created() {
    console.log(this.initial);
  },
  methods: {
    ms() {
      axios.get('https://autumnfish.cn/artist/list?type='+ this.type +'&area='+ this.area +'&initial='+ this.initial +'').then((res)=>{
          console.log(res);
          this.artists = res.data.artists;
    });
    }
  },
  mounted(){
    axios.get('https://autumnfish.cn/artist/list?type='+ this.type +'&area='+ this.area +'&initial='+ this.initial +'').then((res)=>{
          console.log('Slist:',res);
          this.artists = res.data.artists;
    });
    }
}
</script>

<style>
.singer-bottom{
  height: 700px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.singer-bottom>div{
  width: 18%;
  margin-bottom: 30px;
}
.singer-bottom>div p{
  font-size: 18px;
  margin-top: 15px ;
}
.singer-bottom>div img{
  max-width: 100%;
  max-height: 100%;
  border-radius: 5px;
}
</style>