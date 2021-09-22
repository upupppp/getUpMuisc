<template>
  <div class="singer">
    <div class="singer-top">
      <div class="area">
        <div >语种:</div>
        <div class="grey pointer" @click="currentTag1(index)" v-for="(item,index) in area1" :class="{singerCurrent:index == c1 }" :key="index">
          <p class="a">{{item}}</p>
        </div>
      </div>
      <div class="type">
        <div>分类:</div>
        <div class="grey pointer" @click="currentTag2(index)" v-for="(item,index) in type1" :class="{singerCurrent:index == c2 }" :key="index">
          {{item}}
        </div>
      </div>
      <div class="initial">
        <div class="right">筛选:</div>
        <div class="block">
          <div class="grey pointer bug" @click="currentTag3(index)" v-for="(item,index) in initial1" :class="{singerCurrent:index == c3 }" :key="index">
          {{item}}
        </div>
        </div>
      </div>
    </div>
    <Slist v-if="isrefresh" :type="type" :area="area" :initial="initial"></Slist>
  </div>
</template>
<script>
import axios from 'axios'
import Slist from './Slist.vue'
export default {
  components: {
    Slist
  },
  data(){
    return{
      type1:['全部', '男歌手', '女歌手', '乐队组合'],
      type:-1,
      area1:['全部', '华语', '欧美' ,'日本', '韩国', '其他'],
      area:-1,
      initial1:["热门", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "#"],
      initial:-1,
      c1:0,
      c2:0,
      c3:0,
      artists:'',
      isrefresh: true,
    }
  },
  created() {
        
  },
  methods: {
    currentTag1(index) {
      // 语种
      this.c1 = index;
      switch(index) {
        case 0:
          this.area = -1;
          break;
        case 1:
          this.area = 7;
          break;
        case 2:
          this.area = 96;
          break;
        case 3:
          this.area = 8;
          break;
        case 4:
          this.area = 16;
          break;
        case 5:
          this.area = 0;
          break;
      }
      // 强制使子组件刷新
      this.isrefresh = false;
      this.$nextTick(()=> {
        this.isrefresh = true;
      })
    },
    currentTag2(index) {
      // 分类
      this.c2 = index;
      this.type = index == 0?index = -1:index;
      this.isrefresh = false;
      this.$nextTick(()=> {
        this.isrefresh = true;
      })
    },
    currentTag3(index) {
      // 筛选
      this.c3 = index;
      if(index == 0) {
        this.initial = -1;
      }
      else{
        this.initial = this.initial1[index];
        this.initial = this.initial.toLowerCase();
      }
      this.isrefresh = false;
      this.$nextTick(()=> {
        this.isrefresh = true;
      })
    },
    
  },
  mounted(){
    axios.get('https://autumnfish.cn/artist/list?type='+ this.type +'&area='+ this.area +'&initial='+ this.initial +'').then((res)=>{
          // console.log(res);
          this.artists = res.data.artists;
    });
    }
}
</script>

<style>
.singer{
  width: 60%;
  margin: 0 auto;
  margin-top: 40px;
}
.singer-top>div{
  margin-bottom: 20px;
}
.singer-top>div>div{
  display: inline-block;
  margin: 0px 20px 10px 0px;
  font-size: 18px;
  text-align: center;
  line-height: 25px;
  height: 25px;
  padding: 0 5px 0 5px;
}
.pointer{
  display: inline-block;
  width: 80px;
  border-right: 2px solid rgba(128, 128, 128, 0.089);
}
.singerCurrent{
  border-radius: 20px;
  background: rgba(240, 68, 68, 0.116);
  color: red;
}
.block{
  width: 95%;
  position: relative;
  top: -35px;
  left: 37px;
  
}
.bug{
  margin: 0px 20px 25px 0px;
  font-size: 18px;
  text-align: center;
  line-height: 25px;
  height: 25px;
}
.a{
  cursor: pointer;
}

</style>