<template>
  <div class="shopcart">
    <div class="newsong">
      111
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
  $color:#f3e1e1;
  .newsong {
    color:$color;
  }
</style>