<template>
  <div class="rank" v-if="!loading">
    <div class="rank-top" v-loading="loading">
      <p class="h1">官方榜</p>
      <div class="rank-topList" >
        <div class="topList-b" v-for="item in topMsg" :key="item.index">
          <router-link :to="{path: '/singList', query: {id:item.id}}">
          <img :src="item.coverImgUrl" alt="" >
          <p class="topList-word">
            {{item.updateFrequency}}
          </p>
          </router-link>
        </div>
      </div>
    </div>
    <div class="rank-bottom" v-loading="loading">
      <p class="h1">全球榜</p>
      <div class="rank-bottomList">
        <div class="bottomList-b" v-for="item in bottomMsg" :key="item.index">
          <router-link :to="{path: '/singList', query: {id:item.id}}">
          <img :src="item.coverImgUrl" alt="" >
          <p class="bottomList-word">
            {{item.name}}
          </p>
          
          </router-link>
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
      topMsg:'',
      bottomMsg:'',
      loading:true,
    }
  },
  created() {
    // addEventListener('click', this.click, false)
    document.documentElement.scrollTop = 0;
  },
  beforeDestroy() {
    removeEventListener('click', this.getTopList, false)
  },
  methods: {
    getTopList() {
      axios.get('/toplist/detail').then((res)=>{
          // console.log('详情:',res);
          this.topMsg = res.data.list.filter( n => n.ToplistType != null);
          this.bottomMsg = res.data.list.filter( n => n.ToplistType == null);
          console.log(this.topMsg);
          console.log(this.bottomMsg);
          setTimeout(()=>{
             this.loading = false;
          },700)
    });
    }
  },
  mounted(){
    this.getTopList();
    }
}
</script>

<style>
.rank{
  width: 60%;
  margin: 0 auto;
}
.rank-top{
  width: 100%;
  
}
.rank-bottom{
  width: 100%;
}
.h1{
  font-size: 30px;
  margin: 40px 0px 60px 0px;
}
.rank-topList>div{
  display: inline-block;
  width: 50%;
}
.topList-b{
  margin-bottom: 50px;
}
.topList-b img {
  width: 530px;
  display: inline-block;
}
.topList-word{
  color: white;
  font-size: 28px;
  position: relative;
  top: -180px;
  left: 30%;
}

.rank-bottomList>div{
display: inline-block;
width: 20%;
}
.bottomList-b{
  margin-bottom: 35px;
}
.bottomList-b img {
  width: 200px;
}
.bottomList-word{
  font-size: 20px;
  color: black;
  position: relative;
  top: 10px;
  width: 200px;
  height: 25px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>