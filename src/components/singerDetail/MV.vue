<template>
  <div class="MV">
    <el-row :gutter="200" >
      <el-col v-for="(item,index) in MV" :key="index" :span="8">
        <div class="grid-content">
          <router-link :to="{path: '/mvSon', query: {item:item,avatar:avatar,id:item.id}}">
          <img :src="item.imgurl16v9" mode="widthFix" alt="">
          <p>{{item.name}}</p>
          </router-link>
        </div>
        </el-col>
    </el-row>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  props: {
  },
  data(){
    return{
      id:'',
      MV:[],
      logo:'this.src="'+ require('../../assets/img/用户方形.png')+'"',
      page:1,
      onPullDown:true,
      limit:12,
      avatar:String,
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.avatar = this.$route.query.avatar;
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
      if (scrollTop + windowHeight == scrollHeight && this.onPullDown == true) {
        let page = this.page + 1;
        this.debounce(page, 1);
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
    },
    ms() {
      axios.get('https://autumnfish.cn/artist/mv?id='+ this.id+'&limit='+ this.limit * this.page +'').then((res)=>{
          this.MV = res.data.mvs;
    });
    }
  },
  mounted(){
    axios.get('https://autumnfish.cn/artist/mv?id='+ this.id+'&limit='+ this.limit +'').then((res)=>{
          console.log('res:',res);
          this.MV = res.data.mvs;
          window.addEventListener('scroll',this.handleScroll);
    });
    }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/index';
  .MV {
    user-select: none;
    .el-row {
      display: flex;
      flex-wrap:wrap;
      margin-top: 50px;
      margin-bottom: 20px;
    &:last-child {
      margin-bottom: 20;
    }
  }
  .el-col {
    width: 32%;
    border-radius: 4px;
    
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    margin-bottom: 50px;
    img {
      width: 400px;
      height: 225px;
      border-radius: 4px;
    }
    p {
      margin-top: 10px;
      color: #303133;
      width: 400px;
      font-size: 20px;
      @extend %overflow;
    }
  }
  .row-bg {
    padding: 10px 0;
  }
  }
</style>