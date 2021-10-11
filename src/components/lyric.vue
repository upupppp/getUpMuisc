<template>
  <div class="lyric">
  </div>
</template>
<script>
    import axios from 'axios'
    export default {
        props: {},
        data() {
            return {

            }
        },
        created() {

        },
        methods: {},
        mounted() {
          axios.get('https://autumnfish.cn/lyric?id=33894312').then((res)=>{
            console.log('url:',res);
            // this.url = res.data.data.url;
          });
        }
    }
</script>

<style>
</style>