<template>
  <div class="Slist" :data="artists" v-loading="loading">
    <div class="singer-bottom" v-if="!loading">
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
      loading:true,
      cancel:null,
      timer:null,
    }
  },
  created() {
    // console.log(1111);
    this.timer = setTimeout(()=> {
        this.ms();
      },500)
  },
  beforeDestroy() {
    removeEventListener('click', this.ms, false)
    removeEventListener('click', this.ms1, false)
    removeEventListener('scroll',this.handleScroll,false)
    // 在规定时间内点击多次则取消之前的事件,不然取消请求
    this.cancel==null?clearTimeout(this.timer):this.cancel('服务器快承受不了了');
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
        let page = this.page + 1;
        this.debounce(page, 50);
        // console.log(1);
      }
    },
    debounce(args, delay) {
      // 防抖但是这里没必要用而且我这个写不出来防抖效果,这里的实际效果是节流
      let timer;
      let _this = this;
      let page = args;
        clearTimeout(timer);
         timer = setTimeout(function() {
          _this.page = page;
          _this.ms();
          // console.log('args:',page)
        }, delay)
      // console.log(22);
      //   this.page = args  
      //   this.ms();
    },
    // ms() {
    //   axios.get('/artist/list?limit='+ this.page * 30 +'&type='+ this.type +'&area='+ this.area +'&initial='+ this.initial +'&param=183y183').then((res)=>{
    //       // console.log('Slist:',res);
    //       this.artists = res.data.artists;
    //       setTimeout(()=>{
    //          this.loading = false;
    //       },0)
    // });
    // },
    ms() {
      let CancelToken = axios.CancelToken
      let self = this
      axios({
        url:'/artist/list',
        params:{
          limit:this.page * 30,
          type:self.type,
          area:self.area,
          initial:self.initial,
          param:'183y183',
        },
        cancelToken: new CancelToken(function executor(c) {
            self.cancel = c
            // console.log(c)
            // 这个参数 c 就是CancelToken构造函数里面自带的取消请求的函数，这里把该函数当参数用
          })
      }).then(res=>{
        // console.log('Slist1:',res);
        self.artists = res.data.artists;
        setTimeout(()=>{
          this.loading = false;
        },0)
      })
    },
    // ms2() {
    //   axios.get('/artist/list?offset='+ this.page * 30 +'&type='+ this.type +'&area='+ this.area +'&initial='+ this.initial +'&param=183y183').then((res)=>{
    //       // console.log('offset:',res);
    //     //   this.artists = res.data.artists;
    //     //   setTimeout(()=>{
    //     //      this.loading = false;
    //     //   },700)
    //     // localStorage.setItem('artists',JSON.stringify(this.artists));
    //   });
    // }
  },
  mounted(){
    window.addEventListener('scroll',this.handleScroll);
    }
}
</script>

<style>
.singer-bottom{
  /* height: 700px; */
  width: 1200px;
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
  width: 183px;
  height: 183px;
  border-radius: 5px;
}
</style>