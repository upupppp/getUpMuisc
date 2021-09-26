<template>
  <div class="detail">
    <div class="main">
      <div class="top">
        <div class="title">
          {{details.name}}简介
        </div>
        <div class="content">
          {{details.briefDesc}}
        </div>
      </div>
      <div class="bottom" v-for="(item,index) in desc" :key="index">
        <div class="title">
          {{item.ti}}
        </div>
        <div class="content" v-for="(item,index) in getContent[index]" :key="index" >
          {{item}}
        </div>
        <!-- <div class="content" :class="{indentContent1:index == 1}" v-show="index == 1" v-for="item in getContent" :key="item.id">
          <span class="indent">{{item}}</span>
        </div>
        <div class="content" :class="{indentContent:index == 2}" v-show="index == 2" v-for="item in getContent" :key="item.id">
          <span class="indent">{{item}}</span>
        </div> -->
      </div>
      <div class="footer">

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
      id:Number,
      desc:Object,
      details:Object,
      indentContent:null,
      arr:[],
    }
  },
  created() {
    this.id = this.$route.query.id;
  },
  computed: {
    // getContent() {
    //   let arr = this.desc[2].txt.split(/[\n]/);
    //   return arr;
    // },
    // getContent1() {
    //   let arr = this.desc[1].txt.split(/[\n]/);
    //   return arr;
    // }
    getContent() {
      for(let i = 0; i < this.desc.length; i++) {
        this.arr.push(this.desc[i].txt.split(/[\n]/));
      }
      console.log(this.arr);
      return this.arr;
    }
  },
  methods: {
    // getContent(content) {
    //   let arr = content.split(/[\n]/);
    //   return arr;
    // },
  },
  mounted(){
    axios.get('https://autumnfish.cn/artist/detail?id='+ this.id +'').then((res)=>{
          console.log('details:',res);
          this.details = res.data.data.artist;
    });
    axios.get('https://autumnfish.cn/artist/desc?id='+ this.id +'').then((res)=>{
          console.log('dese:',res);
          this.desc = res.data.introduction;
    });
    
    }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/index';
  .detail {
    @extend %singerDetailSon;
    position: absolute;
    left: 0px;
    .top {
      .title {
        margin: 10px 0px 20px 0px;
        font-weight: 700;
        font-size: 22px;
      }
      .content {
        text-indent: 30px;
        line-height: 47px;
        color: $b-third;
        margin-bottom: 40px;
      }
    }
    .bottom {
      @extend .top;
      .title {
        margin: 60px 0 20px 0;
      }
      .content {
        white-space: pre-line;
        margin-bottom: 0px !important;
        // 让有\n的换行
      }
    }
    .footer {
      height: 100px;
      padding-top: 100px;
    }
  }
</style>