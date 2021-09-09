<template>
  <div class="detail">
    歌手详情
  </div>
</template>
<script>
import axios from 'axios'
export default {
  props: {
  },
  data(){
    return{
      
    }
  },
  created() {
        
  },
  methods: {
  },
  mounted(){
    axios.get('https://autumnfish.cn/personalized/mv').then((res)=>{
          console.log(res);
    });
    }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/index';
  .detail {
    @extend %singerDetailSon;
  }
</style>