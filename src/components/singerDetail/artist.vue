<template>
  <div class="artist">
    这是相似歌手
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
  .artist {
    @extend %singerDetailC
  }
</style>