<template>
  <div class="album">
    专辑
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
    this.id = this.$route.query.id;
  },
  methods: {
  },
  mounted(){
    axios.get('https://autumnfish.cn/artist/album?id='+ this.id +'&limit=50').then((res)=>{
          console.log('album:',res);
    });
    }
}
</script>
<style lang="scss" scoped>
  @import '../../assets/styles/index';
  .album {
    @extend %singerDetailC
  }
</style>