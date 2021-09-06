<template>
  <div class="Slist">
    <div class="singer-bottom">
      <div class="singer-artists" v-for="(item,index) in artists" :key="index">
        <router-link :to="{path: '/singerDetail', query: {id:item.id}}">
        <img class="artistsPic" mode="aspectFill" v-lazy="item.img1v1Url" :key="item.img1v1Url" >
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
      logo:'this.src="'+ require('../../assets/img/用户方形.png')+'"',
      page:1,
      onPullDown:true,
    }
  },
  created() {
    console.log(this.initial);
  },
  methods: {
    handleScroll() {
      // scrollTop 滚动条滚动时,距离顶部的距离
      let scrollTop = document.documentElement.scrollTop  || document.body.scrollTop;
      // 可视区高度
      let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      // 滚动条总高度
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      // 滚动条到底部的条件
      if (scrollTop + windowHeight == scrollHeight && this.onPullDown == true && this.page != 3) {
        this.page = this.page + 1;
      }
      this.debounce(this.ms(), 1000);
    },
    debounce(args, delay) {
      // 防抖
      let timer;
      let _this = this;
      console.log('args:',args())
      return function(args) {
        clearTimeout(timer);
        let timer = setTimeout(function() {
          this.args();
          console.log('args:',args)
        }, delay)
      }
    },
    ms() {
      axios.get('https://autumnfish.cn/artist/list?&limit='+ this.page * 30 +'&type='+ this.type +'&area='+ this.area +'&initial='+ this.initial +'').then((res)=>{
          console.log('Slist:',res);
          this.artists = res.data.artists;
    });
    }
  },
  mounted(){
    axios.get('https://autumnfish.cn/artist/list?limit=30&type='+ this.type +'&area='+ this.area +'&initial='+ this.initial +'').then((res)=>{
          console.log('Slist:',res);
          this.artists = res.data.artists;
    });
    window.addEventListener('scroll',this.handleScroll);
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