<template>
  <div class="shopcart">
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

<style>

</style>